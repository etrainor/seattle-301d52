'use strict';

const client = require('./client');
require('dotenv').config();

function handleLocation(response, location){
  const sqlQuery = 'SELECT * FROM locations WHERE search_query = $1';
  const input = [location];
  client.query(sqlQuery, input)
    .then(sqlResults => {
      // the city exists in the DB, get the city out of the DB and use that object to send to the front end
      if(sqlResults.rows.length){
        // console.log('I am successful! getting data from the DB', data.rows);
        response.status(200).json(sqlResults.rows[0]);
      } else {
        // make an API call and get the city information from Google API
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${process.env.GEOCODE_API_KEY}`;
        superagent.get(url)
          .then(data => {
            const city = new City(location, data.body);

            console.log('this one!!!', city);

            const sql = `INSERT INTO locations (search_query, formatted_query, latitude, longitude) VALUES ($1, $2, $3, $4)`;
            const safeValues = [city.search_query, city.formatted_query, city.latitude, city.longitude];

            client.query(sql, safeValues)

            response.send(city);

          })
          .catch(error => {
            console.log(error)
            response.send(error).status(500);
          });
      }
  })
}

module.exports = handleLocation;