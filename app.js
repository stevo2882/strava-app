var express 		= require("express"),
	app 			= express(),
	bodyParser 		= require("body-parser"),
	mongoose 		= require("mongoose"),
	request 		= require("request"),
	methodOverride 	= require("method-override"),
	passport 		= require("passport"),
	LocalStrategy 	= require("passport-local")
	User = require("./models/user"),
	Shelf = require("./models/shelf"),
	Comment = require("./models/comment");
	strava = require('strava-v3')

// strava.config({
//   "access_token"  : "36259383cb72bfe100ea772671ea0784bacd51ed",
//   "client_id"     : "54366",
//   "client_secret" : "266b4b22ce8ef23b535308f3eb3e1d9c8a6fc47b",
//   "redirect_uri"  : "http://localhost",
// });

// strava.athlete.get({id:54366},function(err,payload) {
//     if(!err) {
//         console.log(payload);
// 	}
//     else {
//         console.log(err);
//     }
// });

//requring routes
var commentRoutes    = require("./routes/comments"),
    shelfRoutes = require("./routes/shelf"),
    indexRoutes      = require("./routes/index")

mongoose.connect("mongodb://localhost/strava");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

//PASSPORT CONFIG
app.use(require("express-session")({
	secret: "Duncan is the cutest dog",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

app.use(indexRoutes);
app.use(shelfRoutes);
app.use(commentRoutes);
//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(3000, function(){
	console.log("server is listening");
});