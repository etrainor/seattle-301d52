'use strict';

const express = require('express');
require('dotenv').config();
const ejs = require('ejs');

const app = express();
const PORT = process.env.PORT || 3002;

app.set('view engine', 'ejs');

// routes

app.get('/', (request, response) => {
  response.render('index');
})

app.get('/list', (request, response) => {
  response.render('list', {shoppingList: list});
})

app.get('/quantities', (request, response) => {
  response.render('quantities', {groceryObjects: quantities})
})

// Array of groceries for /list route
let list = ['apples', 'celery', 'butter', 'milk', 'eggs'];

// Array of quantities for /details route
let quantities = [
  {name: 'apples', quantity: 4},
  {name: 'celery', quantity: 1},
  {name: 'butter', quantity: 1},
  {name: 'milk', quantity: 2},
  {name: 'eggs', quantity: 12}
]

app.listen(PORT, () => {
  console.log(`app is listening on ${PORT}`);
})


