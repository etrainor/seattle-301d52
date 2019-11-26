'use strict';

// GOAL: render each dog and their info to the index page
// {
//   "name": "Ginger, Destroyer of Pens",
//   "image_url": "ginger.jpeg",
//   "hobbies": "Eating Cables"
// },

const allDogs = [];

function Dog(name, image_url, hobbies){
  this.name = name;
  this.image_url = image_url;
  this.hobbies = hobbies;

  allDogs.push(this);
}

Dog.prototype.render = function(){
  // select all the html in the dog template
  const myTemplate = $('#dog-template').html();
  
  // make a new section to hold my template
  const $newSection = $('<section></section>');

  // put the html from the dog template into the new section
  $newSection.html(myTemplate);

  // find the h2 and fill the text with the name
  $newSection.find('h2').text(this.name);

  // find the p tag and fill with hobbies
  $newSection.find('p').text(this.hobbies);

  // find the image_url and fill with the image url
  $newSection.find('img').attr('src', this.image_url);

  // stick my template onto the DOM
  $('main').append($newSection);
}

//AJAX 
$.get('./data.json', data => {
  data.forEach(dog => {
    new Dog(dog.name, dog.image_url, dog.hobbies).render();
  })
})

  // use ajax to get the data file
  // then run each dog through the constructor function
  // then call a render method on each dog instance
    // we will need an array to hold all the dog instances
