const express = require("express");
const bodyParser = require("body-parser");

const books = require("./data/books");
const members = require("./data/members");

const app = express();
app.use(bodyParser.json());

/* ---------------- BOOK APIs ---------------- */

// Get all books
app.get("/books", (req, res) => {
  res.json(books);
});

// Add new book
app.post("/books", (req, res) => {
  const newBook = {
    id: books.length + 1,
    title: req.body.title,
    author: req.body.author,
    available: true
  };
  books.push(newBook);
  res.status(201).json(newBook);
});

// Delete a book
app.delete("/books/:id", (req, res) => {
  const index = books.findIndex(b => b.id == req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: "Book not found" });
  }
  books.splice(index, 1);
  res.json({ message: "Book deleted" });
});

/* ---------------- MEMBER APIs ---------------- */

// Get all members
app.get("/members", (req, res) => {
  res.json(members);
});

// Add new member
app.post("/members", (req, res) => {
  const member = {
    id: members.length + 1,
    name: req.body.name,
    issuedBookId: null
  };
  members.push(member);
  res.status(201).json(member);
});

/* ---------------- ISSUE / RETURN ---------------- */

// Issue book
app.post("/issue", (req, res) => {
  const { memberId, bookId } = req.body;

  const member = members.find(m => m.id == memberId);
  const book = books.find(b => b.id == bookId);

  if (!member || !book) {
    return res.status(404).json({ message: "Member or Book not found" });
  }

  if (!book.available) {
    return res.status(400).json({ message: "Book already issued" });
  }

  member.issuedBookId = bookId;
  book.available = false;

  res.json({ message: "Book issued successfully" });
});

// Return book
app.post("/return", (req, res) => {
  const { memberId } = req.body;
  const member = members.find(m => m.id == memberId);

  if (!member || member.issuedBookId === null) {
    return res.status(400).json({ message: "No book to return" });
  }

  const book = books.find(b => b.id == member.issuedBookId);
  book.available = true;
  member.issuedBookId = null;

  res.json({ message: "Book returned successfully" });
});

/* ---------------- SERVER ---------------- */

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Library Management Server running on port ${PORT}`);
});
