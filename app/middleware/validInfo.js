module.exports = function (req, res, next) {
  const { usernameInput, emailInput, passwordInput, confirmPasswordInput, role_id } = req.body;

  console.log(req.body)
  function validEmail(userEmail) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
  }

  if (req.path === "/register") {
    if (![usernameInput, emailInput, passwordInput, confirmPasswordInput].every(Boolean)) {
      return res.json("Missing Credentials");
    } else if (!validEmail(emailInput)) {
      return res.json("Invalid Email");
    }
  } else if (req.path === "/login") {
    if (![emailInput, passwordInput].every(Boolean)) {
      return res.json("Missing Credentials");
    } else if (!validEmail(emailInput)) {
      return res.json("Invalid Email");
    }
  }

  next();
};