const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  addToken,
  hasToken,
  getToken,
  removeToken,
} = require("../models/tokenStore");
require("dotenv").config();

const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
];

const generatToken = async (userID) => {
  const getUserId = await users.filter((userData) => {
    return userData.id === userID;
  });

  return jwt.sign({ userId: getUserId[0].id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const generateRefreshToken = async (userID) => {
  const getUserId = await users.find((userData) => {
    return userData.id === userID;
  });

  const token = jwt.sign(
    { userId: getUserId.id },
    process.env.JWT_REFRESH_SECRET
  );
  await addToken(token);

  return token;
};

exports.login = async (req, res) => {
  if (!req.body) return res.status(400).json({ message: "No data provided" });

  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .json({ message: "Please provide email and password" });

  const user = users.find((userData) => {
    return userData.email === email;
  });

  if (!user) return res.status(401).json({ messege: "Invalid credentials" });

  const isMastchPass = await bcrypt.compare(password, user.password);

  if (!isMastchPass)
    return res.status(401).json({ messege: "Invalid credentials" });

  const token = await generatToken(user.id);
  const refresh_token = await generateRefreshToken(user.id);

  res.json({
    messege: "Login Success",
    access_token: token,
    refresh_token: refresh_token,
  });
};

exports.refreshToken = async (req, res) => {
  if (!req.headers["x-refresh-token"])
    return res.status(401).json({ message: "No refresh token provided" });

  const token = req.headers["x-refresh-token"];

  const refreshToken = await hasToken(token);

  if (!token || !refreshToken) {
    return res.status(403).json({ message: "No valid refresh token" });
  }

  try {
    await jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET,
      async (err, decoded) => {
        if (err) return res.status(403).json({ message: "Token invalid" });

        removeToken(token); // rotate
        const newAccessToken = await generatToken(decoded.userId);
        const refresh_token = await generateRefreshToken(decoded.userId);

        res.json({ accessToken: newAccessToken, refresh_token: refresh_token });
      }
    );
  } catch (error) {
    return res.status(403).json({ message: "Token invalid" });
  }
};
