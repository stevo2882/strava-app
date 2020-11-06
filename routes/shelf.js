var express = require("express");
var router  = express.Router();
var request = require("request");
var Shelf = require("../models/shelf");
var strava = require("strava-v3");
const e = require("express");

var movies = [];

router.get("/", function(req, res){
	console.log(movies);
	activities = [];
	strava.athlete.listActivities({id:54366},function(err,activities) {
    	if(err) {
			console.log(err)
		}
    	else {
			res.render("home", {activities: activities});
    	}
	});
	
});

router.post("/searchMovies", function(req, res){
	movies = [];
	var search = req.body.search;
	var page = 1;
	console.log(req.body.search);
	url = "https://omdbapi.com/?apikey=f4e77dc0&s=" + search;
	request(url, function(error, response, body){
	if(!error && response.statusCode == 200){
		var results = JSON.parse(body)["Search"];
		for(var i = 0; i < results.length; i++){
			movies.push(results[i]);
		}
	}
	res.redirect("/");
	});
});

router.get("/movie/:id", function(req, res){
	Shelf.findById(req.params.id).populate("comments").exec(function(err, foundMovie){
        if(err){
            console.log(err);
        } else {
            console.log(foundMovie)
            //render show template with that campground
            res.render("show", {movie: foundMovie});
        }
    });
});

router.get("/activity/:id", function(req, res){
	strava.activities.get({id:req.params.id}, function(err, activity){
		if(err){
			console.log(err)
		}
		else{
			res.render("activity", {activity: activity})
		}
	});
});

router.get("/library", function(req, res){
	    // Get all campgrounds from DB
    Shelf.find({}, function(err, allMovies){
       if(err){
           console.log(err);
       } else {
          res.render("library",{movies : allMovies});
       }
    });
});

router.get("/library/:imdbID", function(req,res){
    url = "https://omdbapi.com/?apikey=f4e77dc0&i=" + req.params.imdbID;
	request(url, function(err, response, body){ 
		if(err){
			console.log(err);
		} else {
			var result = JSON.parse(body);
			var title = result.Title;
			var plot = result.Plot;
			var poster = result.Poster;
			var imdbid = result.imdbID;
			var newMovie = {title: title, plot: plot, poster: poster, imdbid: imdbid};
			res.render("show", {movie: newMovie});
		}
	});
});

router.post("/library/:imdbID", function(req, res){
	url = "https://omdbapi.com/?apikey=f4e77dc0&i=" + req.params.imdbID;
	request(url, function(err, response, body){ 
		if(err){
			console.log(err);
		} else {
			var result = JSON.parse(body);
			var title = result.Title;
			var plot = result.Plot;
			var poster = result.Poster;
			var imdbid = result.imdbID;
			var newMovie = {title: title, plot: plot, poster: poster, imdbid: imdbid};
			Shelf.create(newMovie, function(err, newlyCreated){
				if(err){
					console.log(err);
				} else {
					res.redirect("/library");
				}
			});
		}
	});
});

router.delete("/library/:id", function(req,res){
	Shelf.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log(err);
		} else {
			res.redirect("/library");
		}
	});
});

// Middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

function checkShelfOwnership(req, res, next){
    if(req.isAuthenticated()){
        Shelf.find(req.params.author, function(err, movies){
            if(err){
                res.redirect("back");
            } else {
                movies.forEach(function(movie){
                    if (movie.author.id.equals(req.user._id)){
                        next();
                    } else {
                        res.redirect("back");
                    }
                });
                
            }
        });
    } else {
        res.redirect("back");
    }
}

module.exports = router;