'use strict';

const express = require('express');
require('dotenv').config();
require('ejs');
const pg = require('pg');
const superagent = require('superagent');

const app = express();
const PORT = process.env.PORT || 3001;
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', error => console.error(error));
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended:true}));

// routes
app.get('/', getBooks);
app.get('/searches/new', newSearch);
app.post('/searches', createSearch);
app.get('/books/:id', getBook);
app.post('/books', createBook);

function getBooks(request, response){
  // go to the DB, get all books and display them
  let sql = 'SELECT * FROM books;';
  client.query(sql)
    .then(results => {
      const bookArr = results.rows;
      response.render('pages/index', {books: bookArr})
    })
}

function newSearch(request, response){
  response.render('pages/searches/new');
  // display the search form
}

function createSearch(request, response){
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';

  if(request.body.search[1] === 'title'){
    url += `+intitle:${request.body.search[0]}`;
  }

  if(request.body.search[1] === 'author'){
    url += `+inauthor:${request.body.search[0]}`;
  }

  superagent.get(url)
    .then(results => {
      let bookArray = results.body.items.map(book => new Book(book.volumeInfo));

      bookArray.slice(0,10);

      response.render('pages/searches/show', {books: bookArray})
    })
    .catch(err => handleError(err, response));
  // take in the form data
  // go the google API
  // render all the books that match
}

function Book(bookObj){
  const bookImage = `https://i.imgur.com/J5LVHEL.jpg`;
  this.image_url = bookObj.imageLinks.thumbnail || `https://i.imgur.com/J5LVHEL.jpg`;
  this.title = bookObj.title || 'no title available';
  this.author = bookObj.authors || 'Author unknown';
  this.description = bookObj.description || 'no description available';
  this.isb = bookObj.isb || 'no isb available';
  this.bookshelf = bookObj.bookshelf || 'no input'; 
}

function getBook(request, response){
  let id = request.params.id;
  
  let sql = 'SELECT * FROM books WHERE id=$1;';
  let safeValues = [id];

  client.query(sql, safeValues)
    .then(results => {
      let bookIWant = results.rows[0];
      response.render('pages/books/details', {book: bookIWant});
    })
  // go to the DB, find a book by the ID and display the details
}

function createBook(request, response){
  console.log(request.body);

  let {author, title, description, bookshelf} = request.body;
  

  let sql = 'INSERT INTO books (title, author, description, bookshelf) VALUES ($1, $2, $3, $4) RETURNING ID;';
  let safeValues = [title, author, description, bookshelf];

  client.query(sql, safeValues)
    .then(results => {
      const id = results.rows[0].id;
      // let sql = 'SELECT * FROM books WHERE id=$1;';
      // let safeValues = [id];

      // client.query(sql, safeValues)
      //   .then(results => {
      //     let bookIWant = results.rows[0];
      //     response.render('pages/books/details', {book: bookIWant});
      // })
      response.redirect(`/books/${id}`)
    })
  // send a book to the database
  // redirect to the detail page
}

function handleError(err, response){
  console.error(err);
  response.status(500).send('oops, no workie');
}

client.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`listening on ${PORT}`);
    })
  })