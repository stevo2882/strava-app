var mongoose = require("mongoose");

var shelfSchema = new mongoose.Schema({
	title: String,
	plot: String,
    poster: String,
	imdbid: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});

module.exports = mongoose.model("Shelf", shelfSchema);