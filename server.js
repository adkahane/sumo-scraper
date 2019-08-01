var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require ("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");

var PORT = process.env.PORT || 3000;

var app = express();

// Set up Handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");

// Configure morgan logger
app.use(logger("dev"));
// body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Serve public folder as a static directory
app.use(express.static("public"));

// Set mongoose to use promises
// Connect to Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/sumo_db";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true
});

// GET route scrapes JapanTimes for sumo news
app.get("/scrape", function(req,res) {
  
  // Drop articles from DB before scraping new ones
  mongoose.connection.collections["articles"].drop(function(err) {
    console.log("Collection Dropped");
  });

  axios.get("https://www.japantimes.co.jp/sports/sumo/").then(function(response) {
    var $ = cheerio.load(response.data);
    // Grab article info and save to result object
    $("article").each(function(i, element) {
      var result = {};
      result.title = $(this)
        .children("div")
        .children("header")
        .children("hgroup")
        .children("p")
        .children("a")
        .text();
      result.link = $(this)
        .children("figure")
        .children("a")
        .attr("href");
      result.photo = $(this)
        .children("figure")
        .children("a")
        .children("img")
        .attr("src");
      result.sum = $(this)
        .children("div")
        .children("p")
        .text().trim();

      // Create a new Article in the DB
      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          return res.json(err);
        });
    });
    console.log("Scrape Complete");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.get("/", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      res.render("index", dbArticle);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});