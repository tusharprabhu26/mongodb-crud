const mongoose = require('mongoose');

// schema for the book
const bookSchema = new mongoose.Schema({
  title: {type: String, required: true},
  author: {type: String, required: true},
  year: {type: Number, required: true},
});

// Create the model for the book
const Book = mongoose.model('Book', bookSchema);

// Connect to the database
async function connectToDatabase(uri) {
  try {
    await mongoose.connect(uri);
    return true;
  } catch (error) {
    return false;
  }
}

// Drop the database
async function dropDatabase() {
  if (mongoose.connection.readyState != 1) {
    return false;
  }
  await mongoose.connection.dropDatabase();
  return true;
}

// Insertmultiple books
async function insertBooks(books) {
  try {
    await Book.insertMany(books);
    return true;
  } catch (error) {
    return false;
  }
}

// Display all books
async function displayBooks() {
  try {
    const allBooks = await Book.find();
    return allBooks;
  } catch (error) {
    return [];
  }
}

// Delete a book
async function deleteBook(title) {
  try {
    await Book.deleteOne({title});
    return true;
  } catch (error) {
    return false;
  }
}

// Insert a book
async function insertBook(book) {
  const newBook = new Book(book);
  try {
    await newBook.save(); // Save the document immediately
    return true;
  } catch (error) {
    return false;
  }
}

// Update a book
async function updateBook(title, data) {
  try {
    await Book.findOneAndUpdate({title}, data);
    return true;
  } catch (error) {
    return false;
  }
}

// Close mongoose connection
async function closeConnection() {
  await mongoose.connection.close();
  return true;
}

module.exports = {
  connectToDatabase,
  dropDatabase,
  insertBooks,
  displayBooks,
  deleteBook,
  insertBook,
  updateBook,
  closeConnection,
  Book,
};
