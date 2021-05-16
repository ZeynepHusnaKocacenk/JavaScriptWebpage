const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Person = require('./PersonModel');
const Review = require('./ReviewModel')

let movieSchema = Schema({
    Title: { type: String, required: true },
    Year: { type: String},
    Runtime: { type: String},
    Genre: [String],
    Rated: {type: String},
    Released: {type: String},
    Director: [{type: Schema.Types.ObjectId, ref: 'Person'}],
    Writer: [{type: Schema.Types.ObjectId, ref: 'Person'}],
    Actor: [{type: Schema.Types.ObjectId, ref: 'Person'}],
    Plot: {type: String},
    Awards: [{type: String}],
    Poster: {type: String},
    //Reviews: [{type: mongoose.Schema.Types.ObjectId, ref: 'Review'}]
})

movieSchema.methods.findSimilarMovies = function(callback){
	return this.model("Movie").find().limit(5).exec(callback);
}

module.exports = mongoose.model("Movie", movieSchema);
const Movie = module.exports;