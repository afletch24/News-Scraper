var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var app = express.Router();

// scraping tools
var request = require("request");
var cheerio = require("cheerio");

// requiring models
var Notes = require("../models/Notes");
var Article = require("../models/Article");

// A get request to scrape the website
app.get("/scrape", function(req, res){
    // scrpaing the body of the html
    request("http://www.theonion.com/", function(error, response, html){
        var $ = cheerio.load(html);

        $("h2.headline").each(function(i, element){
            
            var result = {};

            result.title = $(this).children("a").attr("title");
            result.link = $(this).children("a").attr("href");

            if(result.title && result.link){
                Article.find({title: result.title}, function(err, exists){
                    if(exists.length){
                        console.log("Article already exists");
                    }
                    else{
                        var newArticle = new Article(result);

                        newArticle.save(function(err, doc){
                            if(err){
                                console.log(err);
                            }
                            else{
                                console.log("Server.js XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
                                console.log(doc);
                            }
                        });
                    }
                });
            } 
        });
    });
    // res.sendFile(path.join(__dirname, "../public/index.html"));
    res.end();
});

app.get("/articles", function(req, res){
  Article.find({}, function(error, found){
    if(error){
      console.log(error);
    }else{
      res.json(found);
      console.log("/articles");
    }
  });
});

app.get("/articles/:id", function(req, res){
   Article.findOne({"_id": req.params.id})
   .populate("notes")
   .exec(function(error, doc){
        if(error){
            console.log(error);
        }
        else{
            res.json(doc);
        }
   });
});

app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  var newNotes = new Notes(req.body);

  // And save the new note the db
  newNotes.save(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise
    else {
      // Use the article id to find and update it's note
      Article.findOneAndUpdate({ "_id": req.params.id }, { "notes": doc._id })
      // Execute the above query
      .exec(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        else {
          // Or send the document to the browser
          res.send(doc);
        }
      });
    }
  });
});

module.exports = app;