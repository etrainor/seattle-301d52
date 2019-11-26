'use strict';

// constructor
const allHorns = [];
const allKeywords = [];

function Horns(horn){
  this.image_url = horn.image_url;
  this.title = horn.title;
  this.description = horn.description;
  this.keyword = horn.keyword;
  this.horns = horn.horns;

  allHorns.push(this);
}

// render prototype
Horns.prototype.render = function(){
  const myTemplate = $('#photo-template').html();
  const $newSection = $('<section></section>');
  $newSection.html(myTemplate);
  $newSection.find('h2').text(this.title);
  $newSection.find('p').text(this.description);
  $newSection.find('img').attr('src', this.image_url);
  $newSection.attr('class', this.keyword);
  $('main').append($newSection);
};


// $.get to get the things from the .json
$.get('page-1.json', horns => {
  horns.forEach(horn => {
    new Horns(horn).render();
  })
  getKeywords();
})


// function to do the dropdown with UNIQUE keywords
function getKeywords(){
  const uniqueKeywords = [];
  
  // go through the horns objects, look at the keywords, if it is not in the array, add it
  allHorns.forEach(image => {
    if(!uniqueKeywords.includes(image.keyword)){
      uniqueKeywords.push(image.keyword);
    }
  })

  uniqueKeywords.forEach(keyword => {
    let optionTag = `<option value=${keyword}>${keyword}</option>`;
    $('select').append(optionTag);
  })
}

// event handler for the selection
// const handleFilter = () => {
  // anytime the select changes
  $('select').on('change', function(){
    let thingThatWasClicked = $(this).val();
    if(thingThatWasClicked !== 'default'){
      $('section').hide();
      // I added a class to all my sections so that I could do this! line 25
      $(`section.${thingThatWasClicked}`).fadeIn();
    }
  })
  // find the thing that was clicked on
  // as long as it isn't the default
  // clear all the images
  // just show the images with the keywords that were clicked on
// }
