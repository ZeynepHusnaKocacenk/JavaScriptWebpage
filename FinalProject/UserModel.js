const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Movie = require('./MovieModel');
const Person = require('./PersonModel');
const Review = require('./ReviewModel');


let userSchema = Schema({
    username: {
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    FollowingPeople:[{type: mongoose.Schema.Types.ObjectId, ref: 'Person'}],
    FollowingUsers: [],
    WatchList: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}],
    //Reviews: [{type: mongoose.Schema.Types.ObjectId, ref: 'Review'}]
});

// userSchema.statics.ifExists = function(username, callback) {
  

  


module.exports = mongoose.model("User", userSchema);
