'use strict';

const Person = function(name, age) {
  this.name = name;
  this.age = age;
};
Person.prototype.getName = function() { return this.name; };

let person = new Person('Fred', 51);

// bad code -- references the same thing over and over
function sayName(person) {
  const name = person.getName();
  return person.age >= 50 ? name.toUpperCase() : name.toLowerCase();
}


// CHALLENGE: GET RID OF THE REPITION


///////////////////////////////////////////////////////////

// This is a function that returns a promise
function doSomethingAsync(person) {
  return Promise.resolve(person);
}

doSomethingAsync(person)
  .then( data => { 
    data.name = data.name.toUpperCase();
    console.log('ugly upper', data.name);
    return data;
  })
  .then(differentData => {
    differentData.name = differentData.name.toLowerCase();
    console.log('ugly lower', differentData.name);
  });

// CHALLENGE: refactor this code to be better

doSomethingAsync(person)
  .then( data => changeNameToUpper(data.name))
  .then( name => print(name) )
  .then( differentData => changeNameToLower(differentData.name) )
  .then( name => print(name) )

function changeNameToUpper(name){
  return name.toUpperCase();
}

function changeNameToLower(name){
  name.toLowerCase();
}

function print(words){
  console.log('pretty', words);
  return words;
}