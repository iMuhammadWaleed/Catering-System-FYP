const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const catererRoutes = require("./routes/catererRoutes");
const userRoutes = require("./routes/userRoutes");
const path = require("path");
const cors = require("cors");

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

// CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:3000", // Allow requests from your frontend
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRoutes);
app.use("/api/caterers", catererRoutes);
app.use("/api/users", userRoutes);

// Simple route for testing
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});


