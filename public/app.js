//import simpleParallax from "simple-parallax-js";

// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // Append the articles to the DOM
  for(var i = 0; i < data.length; i++) {
    $("#articles").append(
      "<div class='card'>" + 
        "<img class='card-img-top' src='" + data[i].photo + "' alt='Sumo Image Not Found'>" +
        "<div class='card-body'>" +
          "<h5 class='card-title'>" + data[i].title + "</h5>" +
          "<p class='card-text'><p data-id='" + data[i]._id + "'>" + data[i].sum + "</p>" + "</p>" +
          "<a href='" + data[i].link + "' id='link' class='btn btn-primary'>Full Article</a>" +
        "</div>" +
      "</div>"
    );
  }
  console.log("success");
  
    // Add parallax to the news images
    var images = document.querySelectorAll('img');
    new simpleParallax(images);
});

// When you click the scrape button
$(document).on("click", "#scrape", function() {
  $.ajax({
    url: "/scrape",
  })
  .then(function(data) {
    location.reload();
  });
});

/*
// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
}); 

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
}); */
