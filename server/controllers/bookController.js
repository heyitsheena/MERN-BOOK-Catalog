const Book = require("../models/Book");

// Get all books with search and pagination
const getBooks = async (req, res) => {
  try {
    const { search, page = 1 } = req.query;

    const limit = 5;
    const skip = (Number(page) - 1) * limit;

    let filter = {};

    if (search) {
      filter = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { author: { $regex: search, $options: "i" } },
        ],
      };
    }

    const books = await Book.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalBooks = await Book.countDocuments(filter);

    res.status(200).json({
      books,
      currentPage: Number(page),
      totalPages: Math.ceil(totalBooks / limit),
      totalBooks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new book
const addBook = async (req, res) => {
  try {
    const { title, author, publicationYear } = req.body;

    if (!title || !author || !publicationYear) {
      return res.status(400).json({
        message: "Please fill in all fields.",
      });
    }

    const newBook = new Book({
      title,
      author,
      publicationYear,
    });

    await newBook.save();

    res.status(201).json({
      message: "Book added successfully!",
      book: newBook,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Edit an existing book
const editBook = async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return res.status(404).json({
        message: "Book not found.",
      });
    }

    res.status(200).json({
      message: "Book updated successfully!",
      book: updatedBook,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a book
const deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);

    if (!deletedBook) {
      return res.status(404).json({
        message: "Book not found.",
      });
    }

    res.status(200).json({
      message: "Book deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Export functions
module.exports = { getBooks, addBook, editBook, deleteBook };