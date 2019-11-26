
// select all <a> tags that are children of #list
// when any of them are clicked on, console.log() the text of the <a> tag that was clicked on
// 'this' refers to the event.target in jQuery
$( "#list" ).on( "click", "a", eventHandler)

function eventHandler( event ) {
  console.log( $( this ).text() );
};



// Add a new element on to our existing list dynamically
$( "#list" ).append( "<li><a>I am a dynamically rendered item.</a></li>" );

$( "#list" ).append( "<li><a>So am I. We don't exist in the HTML</a></li>" );

// how do we make it so that EVERY <a> console.logs() the text?
// work together - you have 15 minutes to solve this
  // step 1. dynamically render two new list items just like I did above
  // step 2. console.log( $(this).text()) whenever anyone clicks on any list item
  // step 3. make it so that the console log will run even on the dynamically rendered items.
