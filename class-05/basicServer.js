'use strict';

const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

// routes
// app.get('/', (request, response) => {
//   response.redirect('index.html');
// })

app.get('/hello', (request, response) => {
  response.send('Hello');
})

app.get('/data', (request, response) => {
  let chris = {
    name: 'Chris',
    hair: 'dark brown', 
    eyes: 'brown', 
    favoriteFood: 'curry',
    favoriteDrink: 'beer'
  }

  response.status(200).json(chris);
})

app.use('*', (request, response)=>{
  response.status(404).send('Sorry, that route does not exsist');
})



app.listen(PORT, () => console.log(`listening on ${PORT}`));