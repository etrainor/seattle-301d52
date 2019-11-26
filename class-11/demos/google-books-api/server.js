'use strict';

const express = require('express');
require('dotenv').config();
require('ejs');
const superagent = require('superagent');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// routes

app.get('/', newSearch);
app.post('/searches', searchForBooks);

function newSearch(request, response){
  response.render('pages/index');
}

function searchForBooks(request, response){
  console.log(request.body.search);
  // [ 'name of the wind', 'title' ]
  // [ 'jeff noon', 'author' ]
  const thingUserSearchedFor = request.body.search[0];
  const typeOfSearch = request.body.search[1];

  let url = `https://www.googleapis.com/books/v1/volumes?q=`;

  if(typeOfSearch === 'title'){
    url += `+intitle:${thingUserSearchedFor}`;
  }

  if(typeOfSearch === 'author'){
    url += `+inauthor:${thingUserSearchedFor}`;
  }

  superagent.get(url)
    .then(results => {
      const bookArray = results.body.items.map(book => {
        return new Book(book.volumeInfo);
      })

      response.status(200).render('pages/searches/show');
    })
    // I should handle errors here probably
}

function Book(bookObj){
  const placeholderImage = `https://i.imgur.com/J5LVHEL.jpg`;
  this.title = bookObj.title || 'no title available';
}

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
})

