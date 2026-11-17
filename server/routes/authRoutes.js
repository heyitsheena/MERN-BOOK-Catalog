const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getMe,
} = require("../controllers/authController");

const verifyToken = require("../middleware/authMiddleware");

// Register account
router.post("/register", register);

// Login account
router.post("/login", login);

// Get logged-in user's details
router.get("/me", verifyToken, getMe);

module.exports = router;