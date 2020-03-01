var express = require("express");
var exphbs = require("express-handlebars");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");
var PORT = process.env.PORT || 3000;
var app = express();

app.use(logger("dev"));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));
app.use(express.static("views"));

app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main"
    })
);
app.set("view engine", "handlebars");


mongoose.connect("mongodb://localhost/mongoWebScraper", { useNewUrlParser: true });

app.get("/", function (req, res) {
    db.Articles.find({
        saved: false
    },

        function (error, dbArticles) {
            if (error) {
                console.log(error);
            } else {
                res.render("index", {
                    articles: dbArticles
                });
            }
        }).lean();
});

// GET route for scraping hjnews website
app.get("/scrape", function (req, res) {
    //Axios grabs HTML body
    axios.get("https://www.standard.net/news").then(function (response) {
        //Loads in to cheerio and create shorthand
        var $ = cheerio.load(response.data);

        $("div.card-body").each(function (i, element) {

            var title = $(this).children("div.card-headline").children("h3.tnt-headline").text().trim();
            var link = "https://www.standard.net/news" + $(this).children("div.card-headline").children("h3.tnt-headline").children("a").attr("href");
            var info = $(this).children("div.card-lead").children("p.tnt-summary").text().trim();

            if (title && link && info) {
                db.Articles.create({
                    title: title,
                    link: link,
                    info: info
                },
                    function (error, results) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log(results);
                        }
                    });
            }
        });
        res.sendStatus(204);
    });
});

app.get("/saved", function (req, res) {
    db.Articles.find({ 
        saved: true 
    },
        function(error, dbArticles) {
            if(error) {
                console.log(error)
            } else {
                res.render("saved_articles", {
                    articles: dbArticles
                });
            }
        }).lean();
});

app.put("/saved/:id", function (req, res) {
    db.Articles.findByIdAndUpdate(
        req.params.id, {
        $set: req.body
    }, {
        new: true
    })
        .then(function (dbArticles) {
            res.json(dbArticles)
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.get("/newnote/:id", function(req, res) {
    db.Notes.create(req.body)
        .then(function(dbNotes) {
            var articleId = mongoose.Types.ObjectId(req.params.id)
            return db.Articles.findByIdAndUpdate(articleId, {
                $push: {
                    notes: dbNote._id
                }
            })
        })
        .then(function(dbArticles) {
            res.json(dbNotes);
        })
        .catch(function(error) {
            res.json(error);
        });
});

app.get("/delete", function (req, res) {
    db.Articles.deleteMany({})
        .then(
            res.sendStatus(204));
});

app.listen(PORT, function () {
    console.log("App is running on port " + PORT);
});