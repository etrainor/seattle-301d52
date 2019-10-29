'use strict';

const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static('./public'));

// asks express to look in the body of the request object and parse what it finds so that we can read it
app.use(express.urlencoded({extended:true}));

app.post('/contact', (request, response) => {
  console.log(request.body);
  response.sendFile('./thanks.html', {root: './public'} );
})

app.get('*', (request, response) => {
  response.status(404).send('this route does not exist');
})

app.listen(PORT, () => {
  console.log(`app is on ${PORT}`);
})