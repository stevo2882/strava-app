var express = require("express");
var router  = express.Router({mergeParams: true});
var Shelf = require("../models/shelf");
var Comment = require("../models/comment");

//=====================
// COMMENT ROUTES
//=====================
router.get("/movie/:id/comments/new", isLoggedIn, function(req, res){
    // find campground by id
    Shelf.findById(req.params.id, function(err, movie){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {movie: movie});
        }
    })
});

//Comments Create
router.post("/movie/:id/comments",isLoggedIn,function(req, res){
	//lookup campground using ID
	Shelf.findById(req.params.id, function(err, movie){
		if(err){
			console.log(err);
			res.redirect("/library");
		} else {
		 Comment.create(req.body.comment, function(err, comment){
			if(err){
				console.log(err);
			} else {
				movie.comments.push(comment);
				movie.save();
				res.redirect('/movie/' + movie._id);
			}
		 });
		}
	});
 });

 //middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

 module.exports = router;