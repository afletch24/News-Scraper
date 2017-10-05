var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");
var logger = require("morgan");
var Article = require("./models/article.js")
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

            console.log(result.title);
            console.log(result.link);

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
    }
  });
});

app.listen(3000, function() {
  console.log("App running on port 3000!");
});