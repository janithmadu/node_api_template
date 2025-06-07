const express = require("express");
const cors = require("cors");
const app = express();
const authRoutes = require("./routes/authRoutes");
// This is used to allow cross-origin requests for all domains
app.use(cors());

//using this we can we can allow only needed domain and need method to backend API's
// app.use(cors({
//   origin: 'https://your-frontend-domain.com',
//   methods: ['GET', 'POST'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// For parsing JSON request bodies
app.use(express.json());

//Example Route
//app.use('/api/users', userRoutes);

app.use("/api/auth", authRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
