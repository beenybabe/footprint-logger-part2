// middleware/auth.js
const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "No token, access denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.user = verified.id;
    next();
  } catch (err) {
    res.status(401).json({ error: "Token invalid" });
  }
}

module.exports = auth;
