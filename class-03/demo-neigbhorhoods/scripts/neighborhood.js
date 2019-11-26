'use strict'

// GOAL: render the dataSet to the DOM
let neighborhoods = [];

function Neighborhood(obj){
  this.name = obj.name;
  this.city = obj.city;
  this.population = obj.population;
  this.founded = obj.founded;
  this.body = obj.body;

  neighborhoods.push(this);
}

// function Neighborhood(obj){
//   for(let key in obj){// iterates over the keys in an object
//     this[key] = obj[key]; // for every key in teh object, we are assigned the value that came with that key to that key
//   }
// }

Neighborhood.prototype.render = function(){
  var source   = $("#hood-template").html();
  var template = Handlebars.compile(source);
  return template(this);
}

neighborhoodDataSet.forEach(hood => {
  $('#neighborhoods').append(new Neighborhood(hood).render());
})
