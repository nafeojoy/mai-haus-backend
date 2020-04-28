const bcrypt = require("bcrypt");
import jwtGenerator from "../utlis/jwtGenerator";

export default(app, router, client, authorize, validInfo) => {

  router.post("/register", validInfo, async (req, res) => {
    // const { email, name, password, role_id } = req.body;
    const { usernameInput, emailInput, passwordInput,confirmPasswordInput, role_id  } = req.body;

    let verification_code = `usr${new Date().getTime()}`;

    try {
      const user = await client.query("SELECT * FROM users WHERE user_email = $1 or user_name = $2", [
        emailInput, usernameInput
      ]);
      if (user.rows.length > 0) {
        return res.status(401).json("User already exist!");
      }

      const salt = await bcrypt.genSalt(10);
      const bcryptPassword = await bcrypt.hash(passwordInput, salt);

      let newUser = await client.query(
        "INSERT INTO users (user_name, user_email, user_password, verification_code) VALUES ($1, $2, $3, $4) RETURNING *",
        [usernameInput, emailInput, bcryptPassword, verification_code]
      );

      const jwtToken = jwtGenerator(newUser.rows[0].user_id);
      const data = {usernameInput, emailInput}

      return res.json({ jwtToken, data });
    } catch (err) {
      // console.error(err.message);
      res.status(500).send("Server error");
    }
  });

  router.post("/login", async (req, res) => {
    const { emailInput, passwordInput } = req.body;

    try {
      const user = await client.query("SELECT * FROM users WHERE user_email = $1 or user_name = $1", [
        emailInput
      ]);

      if (user.rows.length === 0) {
        return res.status(401).json("Invalid Email/ Username");
      }

      const validPassword = await bcrypt.compare(
        passwordInput,
        user.rows[0].user_password
      );

      if (!validPassword) {
        return res.status(401).json("Invalid Password");
      }
      const jwtToken = jwtGenerator(user.rows[0].user_id);
      return res.json({ jwtToken });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  });

  router.post("/verify", authorize, (req, res) => {
    try {
      res.json(true);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  });

}

