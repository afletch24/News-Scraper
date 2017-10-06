var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");
var logger = require("morgan");
var Article = require("./models/article.js");
var Notes = require("./models/Notes.js");
var path = require("path");

mongoose.Promise = Promise;

var app = express();

app.use(express.static("public"));

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Mongoose database configuration
var promise = mongoose.connect("mongodb://localhost/ScrapingTheOnion", {
  useMongoClient: true,
});

promise.then(function(db){
    db.on("error", function(error){
    console.log("Mongoose Error: ", error);
    });

    // success message once logged in to db mongoose
    db.once("open", function(){
        console.log("Mongoose connection successful");
    });
});



app.get("/scrape", function(req, res){
    
    request("http://www.theonion.com/", function(error, response, html){
        
        var $ = cheerio.load(html);

        $("h2.headline").each(function(i, element){
            
            var result = {};

            result.title = $(this).children("a").attr("title");
            result.link = $(this).children("a").attr("href");

            var newArticle = new Article(result);

            newArticle.save(function(err, doc){
                if(err){
                    console.log(err);
                }
                else{
                    // console.log("Server.js XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
                    // console.log(doc);
                }
            });
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
  var newNote = new Notes(req.body);

  // And save the new note the db
  newNote.save(function(error, doc) {
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




app.listen(3000, function() {
  console.log("App running on port 3000!");
});