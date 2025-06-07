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
    if (error.name === "TokenExpiredError") {
      console.error("Token has expired at:", error.expiredAt);
      return res
        .status(401)
        .json({ message: "Token has expired", expiredAt: error.expiredAt });
    } else if (error.name === "JsonWebTokenError") {
      console.error("JWT error:", error.message);
      return res.status(403).json({ message: "Invalid token" });
    } else {
      console.error("Unexpected error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};
