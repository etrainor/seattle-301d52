'use strict';

function insertIntoDataBase(){
  // put the location object into the Database
  const sql = `INSERT INTO locations (search_query, formatted_query, latitude, longitude) VALUES ($1, $2, $3, $4)`;

  const safeValues = [locationObject.search_query, locationObject.formatted_address, locationObject.latitude, locationObject.longitude];

  client.query(sql, safeValues);
}

module.exports = insertIntoDataBase;