import jwt from 'jsonwebtoken';

require("dotenv").config();

//this middleware will on continue on if the token is inside the local storage
export default (req, res, next) => {
  // Get token from header
  const token = req.header("jwt_token");

  // Check if not token
  if (!token) {
    return res.status(403).json({ msg: "authorization denied" });
  }

  // Verify token
  try {
    const verify = jwt.verify(token, process.env.jwtSecret);
    console.log(verify)
    req.user = verify.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};