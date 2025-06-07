const express = require("express");
const router = express.Router();
const { login, refreshToken } = require("../controllers/authController");
const { protected } = require("../middleware/authMiddleware");

//Public Routes

router.post("/login", login);
router.post("/refresh", refreshToken);

//Protected Routes

router.get("/protected", protected, (req, res) => {
  res.json({ message: `Hello user ${req.user.userId}` });
});

module.exports = router;
