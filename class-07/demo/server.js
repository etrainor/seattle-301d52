'use strict';

// bring in the dependencies
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const superagent = require('superagent');

// configure the environmental variables
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3001;

// routes
app.get('/location', handleLocation);
app.get('/weather', handleWeather);

// functions
function handleLocation(request, response) {
    const location = request.query.data;

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${process.env.GEOCODE_API_KEY}`;

    superagent.get(url)
      .then(resultsFromSuperagent => {
        // console.log(resultsFromSuperagent.body.results[0].geometry);
        const locationObj = new Location(location, resultsFromSuperagent.body.results[0]);
        response.status(200).send(locationObj);
      })
      .catch ((error) => {
        console.error(error);
        response.status(500).send('we messed up. sorry.');
      })

}

function Location(city, geoData){
  this.search_query = city;
  this.formatted_query = geoData.formatted_address;
  this.latitude = geoData.geometry.location.lat;
  this.longitude = geoData.geometry.location.lng;
}

function handleWeather(request, response){
  console.log('the thing the front sent us', request.query.data);
  const locationObject = request.query.data;

  const url = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${locationObject.latitude},${locationObject.longitude}`;

  superagent.get(url)
    .then(resultsFromSuperagent => {
      console.log(resultsFromSuperagent.body);

      const weeklyWeather = resultsFromSuperagent.body.daily.data.map(day => {
        return new Weather(day);
    })

    response.status(200).send(weeklyWeather);
  })
  .catch ((error) => {
    console.error(error);
    response.status(500).send('we messed up. sorry.');
  })
}

function Weather(obj){
  this.forecast = obj.summary;
  this.time = new Date(obj.time * 1000).toDateString();
}

// turn on the server
app.listen(PORT, () => console.log(`I have life on ${PORT}`));