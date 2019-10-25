'use strict';

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
require('dotenv').config();

const handleLocation = require('./location');
const client = require('./client');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3002;


// routes

app.get('/location', handleLocation);


app.get('/weather', (request, response) => {
  const locationObject = request.query.data;
  console.log({locationObject});

  const url = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${locationObject.latitude},${locationObject.longitude}`;

  superagent.get(url)
    .then(data => {

      const weatherList = data.body.daily.data.map(dailyWeather => new Forecast(dailyWeather));

      response.status(200).send(weatherList);
    })
    .catch(error => {

      console.error(error);
      response.send(error).status(500);

    });

})

// app.get('/yelp', (request, response) => {
//   const location = request.query.data;

//   const url = `https://api.yelp.com/v3/businesses/search?location=${location.search_query}`;

//   superagent.get(url)
//     .set('Authorization', `Bearer ${process.env.YELP_API_KEY}`)
//     .then(results => {
//       const yelpSummaries = results.body.bussinesses.map(business => {

//       })
//     })
// })


function Forecast(weatherObject){
  this.forecast = weatherObject.summary;
  this.time = new Date(weatherObject.time * 1000).toUTCString();
}

// Error Handler Routes
app.use('*', notFoundHandler);
app.use(errorHandler);

function notFoundHandler(request,response) {
  response.status(404).send('huh?');
}

function errorHandler(error,request,response) {
  response.status(500).send(error);
}

client.connect()
  .then( () => {
    app.listen(PORT, () => console.log(`App is on port ${PORT}`));
  })
  .catch( err => console.error(err));
