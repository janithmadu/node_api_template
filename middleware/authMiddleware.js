const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.protected = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ messege: "Not authorized" });

  const token = authHeader.split(" ")[1];

  try {
    const decondeToken = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decondeToken;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token invalid or expired" });
  }
};
