const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require('./UserModel');
const Movie = require('./MovieModel');


let reviewSchema = Schema({
    user: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    movie: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}],
    rating: { type: Number},
    review: {type: String}
})

module.exports = mongoose.model("Review", reviewSchema);
const Review = module.exports;