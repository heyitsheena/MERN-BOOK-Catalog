const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Main route
app.get("/", (req, res) => {
  res.send("Book Catalog API is running!");
});

// Authentication routes
app.use("/api/auth", authRoutes);
// Books routes
app.use("/api/books", bookRoutes);

// Connect to MongoDB
const PORT = process.env.PORT || 8800;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected successfully!");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed:", error.message);
  });