

export default (app, router, client, logger, authorize) => {
  router.post("/dashboard", authorize, async (req, res) => {
    try {
      const user = await client.query(
        "SELECT user_name FROM users WHERE user_id = $1",
        [req.user.id]
      );
      res.json(user.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  });

}