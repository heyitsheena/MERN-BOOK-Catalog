const express = require("express");
const router = express.Router();

const {
  getBooks,
  addBook,
  editBook,
  deleteBook,
} = require("../controllers/bookController");

const verifyToken = require("../middleware/authMiddleware");

// Anyone can view books
router.get("/", getBooks);

// Only logged-in users can manage books
router.post("/", verifyToken, addBook);
router.put("/:id", verifyToken, editBook);
router.delete("/:id", verifyToken, deleteBook);

module.exports = router;