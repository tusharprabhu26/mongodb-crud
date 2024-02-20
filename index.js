const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/samplebookdb');

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  year: Number,
});

const Book = mongoose.model('Book', bookSchema);

async function performOperations() {
  // Create 4 books
  const books = [
    {title: 'Book 1', author: 'Author 1', year: 2001},
    {title: 'Book 2', author: 'Author 2', year: 2002},
    {title: 'Book 3', author: 'Author 3', year: 2003},
    {title: 'Book 4', author: 'Author 4', year: 2004},
  ];
  await Book.insertMany(books);

  // Display all books
  let allBooks = await Book.find();
  console.log('All Books:\n', allBooks);

  // Delete one book
  await Book.deleteOne({title: 'Book 1'});

  // Display all books
  allBooks = await Book.find();
  console.log('After deleting one book:\n', allBooks);

  // Insert one book
  const newBook = new Book({title: 'Book 5', author: 'Author 5', year: 2005});
  await newBook.save();

  // Display all books
  allBooks = await Book.find();
  console.log('Inserting new book:\n', allBooks);

  // Update one book
  await Book.updateOne({title: 'Book 2'}, {year: 2024});

  // Display all books
  allBooks = await Book.find();
  console.log('After updating the year of book 2:\n', allBooks);

  // Close mongoose connection
  mongoose.connection.close();
}

performOperations();
