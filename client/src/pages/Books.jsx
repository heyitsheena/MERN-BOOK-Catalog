import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GuidedTour from "../components/GuidedTour";
import api from "../api/axios";

function Books() {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    year: "",
  });

  // Get books from the backend
  async function fetchBooks() {
    try {
      setLoading(true);

      const response = await api.get("/books", {
        params: {
          search: search,
          page: currentPage,
        },
      });

      setBooks(response.data.books);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      setMessage("Unable to load books.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBooks();
  }, [search, currentPage]);

  // Search books
  function handleSearch(event) {
    setSearch(event.target.value);
    setCurrentPage(1);
  }

  // Add book
  async function handleAddBook(event) {
    event.preventDefault();

    try {
      await api.post("/books", {
        title: newBook.title.trim(),
        author: newBook.author.trim(),
        publicationYear: Number(newBook.year),
      });

      resetForm();
      setCurrentPage(1);
      setMessage("Book added successfully!");
      fetchBooks();
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to add book.");
    }
  }

  // Select book for editing
  function handleEditBook(book) {
    setNewBook({
      title: book.title,
      author: book.author,
      year: book.publicationYear,
    });

    setEditingId(book._id);
    setShowForm(true);
  }

  // Update book
  async function handleUpdateBook(event) {
    event.preventDefault();

    try {
      await api.put(`/books/${editingId}`, {
        title: newBook.title.trim(),
        author: newBook.author.trim(),
        publicationYear: Number(newBook.year),
      });

      resetForm();
      setMessage("Book updated successfully!");
      fetchBooks();
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to update book.");
    }
  }

  // Delete book
  async function handleDeleteBook(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this book?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/books/${id}`);

      setMessage("Book deleted successfully!");
      fetchBooks();
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to delete book.");
    }
  }

  // Reset form
  function resetForm() {
    setNewBook({
      title: "",
      author: "",
      year: "",
    });

    setEditingId(null);
    setShowForm(false);
  }

  // Logout
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  }

  return (
    <div className="books-container">
      <GuidedTour />

      <header className="books-header">
        <h1>Book Catalog</h1>

        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="books-content">
        <div className="welcome-section">
          <h2>My Bookshelf</h2>
          <p>Explore and manage your favourite books.</p>
        </div>

        <div className="books-actions">
          <input
            type="text"
            placeholder="Search by book title or author..."
            className="search-input"
            value={search}
            onChange={handleSearch}
          />

          <button
            className="add-button"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            + Add New Book
          </button>
        </div>

        {message && <p>{message}</p>}

        {showForm && (
          <form
            className="add-book-form"
            onSubmit={editingId ? handleUpdateBook : handleAddBook}
          >
            <h2>{editingId ? "Edit Book" : "Add a New Book"}</h2>

            <input
              type="text"
              placeholder="Book Title"
              value={newBook.title}
              onChange={(event) =>
                setNewBook({
                  ...newBook,
                  title: event.target.value,
                })
              }
              required
            />

            <input
              type="text"
              placeholder="Author Name"
              value={newBook.author}
              onChange={(event) =>
                setNewBook({
                  ...newBook,
                  author: event.target.value,
                })
              }
              required
            />

            <input
              type="number"
              placeholder="Publication Year"
              min="1"
              max={new Date().getFullYear()}
              value={newBook.year}
              onChange={(event) =>
                setNewBook({
                  ...newBook,
                  year: event.target.value,
                })
              }
              required
            />

            <button type="submit" className="add-button">
              {editingId ? "Update Book" : "Save Book"}
            </button>

            <button type="button" onClick={resetForm}>
              Cancel
            </button>
          </form>
        )}

        <h2 className="section-title">Available Books</h2>

        <div className="book-list">
          {loading ? (
            <p>Loading books...</p>
          ) : books.length > 0 ? (
            books.map((book) => (
              <div className="book-card" key={book._id}>
                <h3>{book.title}</h3>

                <p>Author: {book.author}</p>

                <p>Publication Year: {book.publicationYear}</p>

                <div className="book-buttons">
                  <button
                    className="edit-button"
                    onClick={() => handleEditBook(book)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-button"
                    onClick={() => handleDeleteBook(book._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <h3>No books found</h3>
              <p>Try searching with another book title or author.</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default Books;
