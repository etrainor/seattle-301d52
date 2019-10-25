'use strict';

const superagent = require('superagent');
const client = require('./client');
const Location = require('./locationConstructor');
const insertIntoDataBase = require('./insertIntoDataBase');


function handleLocation(request, response){
  const city = request.query.data;
  console.log(city);

  getLocationInfo(city, response);
}

function getLocationInfo(city, response){
    // first check the DB to see if the locaiton exists in the DB
    const sql = `SELECT * FROM locations WHERE search_query=$1`;
    const safeValues = [city];
  
    client.query(sql, safeValues)
      .then(sqlResults => {
        console.log(sqlResults.rows)
        // if the results exists in the data base, we will have something in the results.rows.
        // sqlResults.rows returns an array, so we will need to send the first (and only) item in the array to the front end
  
        if(sqlResults.rows.length){
          console.log('found the location in the database.');
          response.status(200).send(sqlResults.rows[0]);
        } else {
          console.log('in the else')
          // we did not find the search in the database, so we need to make an API call to find the location inforation
  
          getLocationUsingSuperAgent(city, response);
  
        }
      })
}

function getLocationUsingSuperAgent(city, response){
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${process.env.GEOCODE_API_KEY}`;
  
  superagent.get(url)
    .then(superagentResults => {
      console.log('location was not in the DB - getting it from the API');
      const locationObject = new Location(city, superagentResults.body);

      insertIntoDataBase(locationObject);

      // send the location object to the front end
      response.status(200).send(locationObject);
    })
}



module.exports = handleLocation;