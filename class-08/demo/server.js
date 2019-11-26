'use strict';

// Load Environment Variables from the .env file
require('dotenv').config();

// Application Dependencies
const pg = require('pg');
const express = require('express');
const superagent = require('superagent');
const cors = require('cors');

// Application Setup
const PORT = process.env.PORT;
const app = express();
app.use(cors());

// Route Definitions
app.get('/location', locationHandler);
app.get('/weather', weatherHandler);
app.get('/events', eventsHandler);
app.use('*', notFoundHandler);
app.use(errorHandler);


function locationHandler(request,response) {

  const city = request.query.data;

  let SQL = 'SELECT * FROM locations WHERE search_query = $1';
  let values = [city];

  client.query(SQL, values)
    .then( results => {
      if ( results.rowCount ) {
        response.status(200).json(results.rows[0]);
      }
      else {
        let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${process.env.GEOCODE_API_KEY}`;

        superagent.get(url)
          .then(data => {
            const location = new Location(city, data.body);
            let SQL = 'INSERT INTO locations (search_query, formatted_query, latitude, longitude) VALUES ($1, $2, $3, $4) RETURNING *';
            let values = [city, location.formatted_query, location.latitude, location.longitude];
            return client.query(SQL, values);
          })
          .then( results => {
            response.status(200).json(results.rows[0]);
          })
          .catch( (error) => {
            errorHandler(error, request, response);
          });
      }
    });

}

function Location(query, geoData) {
  this.search_query = query;
  this.formatted_query = geoData.results[0].formatted_address;
  this.latitude = geoData.results[0].geometry.location.lat;
  this.longitude = geoData.results[0].geometry.location.lng;
}


// http://localhost:3000/weather?data%5Blatitude%5D=47.6062095&data%5Blongitude%5D=-122.3320708
// That encoded query string is: data[latitude]=47.6062095&data[longitude]=122.3320708
function weatherHandler(request,response) {

  const url = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${request.query.data.latitude},${request.query.data.longitude}`;

  superagent.get(url)
    .then( data => {
      const weatherSummaries = data.body.daily.data.map(day => {
        return new Weather(day);
      });
      response.status(200).json(weatherSummaries);
    })
    .catch( (error) => {
      errorHandler(error, request, response);
    });

}

function Weather(day) {
  this.forecast = day.summary;
  this.time = new Date(day.time * 1000).toString().slice(0, 15);
}

// http://localhost:3000/events?data%5Bformatted_query%5D=Seattle
// That encoded query string is: data[formatted_query]=Seattle
function eventsHandler(request, response) {
  const url = `https://www.eventbriteapi.com/v3/events/search?token=${process.env.EVENTBRITE_API_KEY}&location.address=${request.query.data.formatted_query}`;

  superagent.get(url)
    .then(result => {
      const events = result.body.events.map(eventData => {
        const event = new Event(eventData);
        return event;
      });

      response.send(events);
    })
    .catch(error => errorHandler(error, request, response));
}

function Event(event) {
  this.link = event.url;
  this.name = event.name.text;
  this.event_date = new Date(event.start.local).toString().slice(0, 15);
  this.summary = event.summary;
}


function notFoundHandler(request,response) {
  response.status(404).send('huh?');
}

function errorHandler(error,request,response) {
  response.status(500).send(error);
}


// Make sure the server is listening for requests
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.error(err));

// Make sure the server is listening for requests
client.connect()
  .then( () => app.listen(PORT, () => console.log(`Server up on ${PORT}`) ) )
  .catch( console.error );
