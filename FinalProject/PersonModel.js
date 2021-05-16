const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Movie = require('./MovieModel');

let personSchema = Schema({
    Name: { type: String, required: true },
    FrequentCollaborators: [{type: Schema.Types.ObjectId, ref: 'Person'}],
	Writer: [{type: Schema.Types.ObjectId, ref: 'Movie'}],
	Director: [{type: Schema.Types.ObjectId, ref: 'Movie'}],
	Actor: [{type: Schema.Types.ObjectId, ref: 'Movie'}]
})

module.exports = mongoose.model("Person", personSchema);
const Person = module.exports;