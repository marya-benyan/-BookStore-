import { useState, useEffect } from "react";
import axios from "axios";
import "./BookManager.css"; // استدعاء ملف CSS

const BookManager = () => {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [publicationDate, setPublicationDate] = useState("");
  const [description, setDescription] = useState("");
  const [editBook, setEditBook] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8003/books")
      .then((response) => {
        setBooks(response.data);
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
      });
  }, []);

  const addBook = () => {
    axios
      .post("http://localhost:8003/books", {
        title,
        author,
        genre,
        publication_date: publicationDate,
        description,
      })
      .then((response) => {
        setBooks([...books, response.data]);
        setTitle("");
        setAuthor("");
        setGenre("");
        setPublicationDate("");
        setDescription("");
      })
      .catch((error) => {
        console.error("Error adding book:", error);
      });
  };

  const editBookDetails = (book) => {
    setEditBook(book);
    setTitle(book.title);
    setAuthor(book.author);
    setGenre(book.genre);
    setPublicationDate(book.publication_date);
    setDescription(book.description);
  };

  const updateBook = () => {
    if (editBook) {
      axios
        .put(`http://localhost:8003/books/${editBook.id}`, {
          title,
          author,
          genre,
          publication_date: publicationDate,
          description,
        })
        .then((response) => {
          const updatedBooks = books.map((book) =>
            book.id === editBook.id ? response.data : book
          );
          setBooks(updatedBooks);
          setEditBook(null);
          setTitle("");
          setAuthor("");
          setGenre("");
          setPublicationDate("");
          setDescription("");
        })
        .catch((error) => {
          console.error("Error updating book:", error);
        });
    }
  };

  const deleteBook = (id) => {
    axios
      .delete(`http://localhost:8003/books/${id}`)
      .then(() => {
        setBooks(books.filter((book) => book.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting book:", error);
      });
  };

  return (
    <div className="container">
      <h1>📚 Book Catalog Management</h1>

      {/* Book Form */}
      <div className="book-form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <input
          type="text"
          placeholder="Genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        />
        <input
          type="date"
          value={publicationDate}
          onChange={(e) => setPublicationDate(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={editBook ? updateBook : addBook} className="btn-add">
          {editBook ? "Update Book" : "Add Book"}
        </button>
      </div>

      {/* Book Table */}
      <h2>📖 Book List</h2>
      <table className="book-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Author</th>
            <th>Genre</th>
            <th>Publication Date</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book, index) => (
            <tr key={book.id}>
              <td>{index + 1}</td>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.genre}</td>
              <td>{book.publication_date}</td>
              <td>{book.description}</td>
              <td>
                <button className="btn-edit" onClick={() => editBookDetails(book)}>✏ Edit</button>
                <button className="btn-delete" onClick={() => deleteBook(book.id)}>🗑 Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookManager;
