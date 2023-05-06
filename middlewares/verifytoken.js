const jwt = require("jsonwebtoken");

// Define middleware function to check for valid token
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Unauthenticated" });

  jwt.verify(token, process.env.Token, (err, user) => {
    if (err) return res.status(403).json({ message: "Token Expires" });
    req.user = user;
    // this req.user value can be accessed by req.user in the next route
    next();
  });
}

module.exports = verifyToken;
