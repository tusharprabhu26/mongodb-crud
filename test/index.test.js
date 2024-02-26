const chai = require('chai');
const {MongoMemoryServer} = require('mongodb-memory-server');
const {
  connectToDatabase,
  dropDatabase,
  insertBooks,
  deleteBook,
  insertBook,
  updateBook,
  closeConnection,
  displayBooks,
  Book,
} = require('../index');

const expect = chai.expect;
const mongod = new MongoMemoryServer();

describe('Database Operations', function() {
  this.timeout(5000); // 5 seconds timeout
  let uri;

  beforeEach(async function() {
    console.log('Starting MongoDB instance...');
    await mongod.start();
    uri = await mongod.getUri();
    const isConnected = await connectToDatabase(uri);
    expect(isConnected).to.equal(true);
    console.log('Dropping database...');
    await dropDatabase();
    console.log('Database dropped successfully');
  });

  afterEach(async function() {
    console.log('Closing connection...');
    await closeConnection();
    console.log('Connection closed successfully');
    await mongod.stop();
  });

  it('should connect to database', async function() {
    const isConnected = await connectToDatabase(uri);
    expect(isConnected).to.equal(true);
  });

  it('should drop database', async function() {
    const isDropped = await dropDatabase();
    expect(isDropped).to.equal(true);
  });

  it('should insert books', async function() {
    const books = [
      {title: 'Book 1', author: 'Author 1', year: 2001},
      {title: 'Book 2', author: 'Author 2', year: 2002},
      {title: 'Book 3', author: 'Author 3', year: 2003},
      {title: 'Book 4', author: 'Author 4', year: 2004},
    ];
    const areInserted = await insertBooks(books);
    expect(areInserted).to.equal(true);
  });

  it('should display all books', async function() {
    const books = [
      {title: 'Book 1', author: 'Author 1', year: 2001},
      {title: 'Book 2', author: 'Author 2', year: 2002},
      {title: 'Book 3', author: 'Author 3', year: 2003},
      {title: 'Book 4', author: 'Author 4', year: 2004},
    ];
    await insertBooks(books);
    const allBooks = await displayBooks();
    expect(allBooks.length).to.equal(4);
  });

  it('should delete a book', async function() {
    const isDeleted = await deleteBook('Book 1');
    expect(isDeleted).to.equal(true);
  });

  it('should insert a book with all fields', async function() {
    const newBook = {title: 'Book 5', author: 'Author 5', year: 2005};
    const isInserted = await insertBook(newBook);
    expect(isInserted).to.equal(true);

    // check that the inserted book has all the necessary fields
    const insertedBook = await Book.findOne({title: 'Book 5'});
    expect(insertedBook).to.have.property('title');
    expect(insertedBook).to.have.property('author');
    expect(insertedBook).to.have.property('year');
  });

  it('should not insert a book with missing fields', async function() {
    const incompleteBook = {title: 'Book 6', year: 2006};
    const isInserted = await insertBook(incompleteBook);
    expect(isInserted).to.equal(false);
  });

  it('should not insert a book without a title', async function() {
    const noTitleBook = {author: 'Author 7', year: 2007};
    const isInserted = await insertBook(noTitleBook);
    expect(isInserted).to.equal(false);
  });

  it('should update a book', async function() {
    const isUpdated = await updateBook('Book 2', {year: 2024});
    expect(isUpdated).to.equal(true);
  });

  it('should not insert a book without a year', async function() {
    const noYearBook = {title: 'Book 7', author: 'Author 7'};
    const isInserted = await insertBook(noYearBook);
    expect(isInserted).to.equal(false);
  });

  it('should have the correct model name', function() {
    expect(Book.modelName).to.equal('Book');
  });

  it('should handle connection errors', async function() {
    const isConnected = await connectToDatabase('invalid-uri');
    expect(isConnected).to.equal(false);
  });

  it('should handle drop database errors when not connected', async function() {
    await closeConnection();
    const isDropped = await dropDatabase();
    expect(isDropped).to.equal(false);
  });

  it('should handle insert books errors when not connected', async function() {
    await closeConnection();
    const areInserted = await insertBooks([
      {title: 'Book 1', author: 'Author 1', year: 2001},
    ]);
    expect(areInserted).to.equal(false);
  });

  it('should handle delete book errors when not connected', async function() {
    await closeConnection();
    const isDeleted = await deleteBook('Book 1');
    expect(isDeleted).to.equal(false);
  });

  it('should handle insert book errors when not connected', async function() {
    await closeConnection();
    const isInserted = await insertBook({
      title: 'Book 1',
      author: 'Author 1',
      year: 2001,
    });
    expect(isInserted).to.equal(false);
  });

  it('should handle update book errors when not connected', async function() {
    await closeConnection();
    const isUpdated = await updateBook('Book 1', {year: 2024});
    expect(isUpdated).to.equal(false);
  });

  it('should handle display books errors when not connected', async function() {
    await closeConnection();
    const allBooks = await displayBooks();
    expect(allBooks).to.eql([]);
  });

  it('should close the connection', async function() {
    const isClosed = await closeConnection();
    expect(isClosed).to.equal(true);
  });
});
