/*
Reference:
This database initializer is implemented on the code that professor has provided. 
*/

const mongoose = require("mongoose");
const Movie = require("./MovieModel");
const User = require("./UserModel");
const Person = require("./PersonModel")

const fs = require("fs");

let users = [
	{username: "zeynep",  password: "password1", admin: true, FollowingUsers: [], FollowingPeople: [], Notifications: [] },
	{username: "cemile",  password: "password2", admin: false, FollowingUsers: [], FollowingPeople: [], Notifications: []},
  {username: "busra",  password: "another", admin: true, FollowingUsers: [], FollowingPeople: [], Notifications: [] },
  {username: "husna",  password: "secret", admin: false, FollowingUsers: [], FollowingPeople: [], Notifications: [] }

]

let movieData = require("./movie-data-2500.json");
const MovieModel = require("./MovieModel");
const PersonModel = require("./PersonModel");

let allMovies = [];
let people = {};
let allPeople = [];

function addPersonToMovie(personName, movie, position){
  if(!people.hasOwnProperty(personName)){
    let newPerson = new Person();   
    newPerson._id = mongoose.Types.ObjectId();
    
    newPerson.Name = personName;
    newPerson.Director = [];
    newPerson.Actor = [];
    newPerson.Writer = [];
    allPeople.push(newPerson);
    people[newPerson.Name] = newPerson;
  }
  
  let curPerson = people[personName];
  curPerson[position].push(movie._id);
  movie[position].push(curPerson._id);
}

movieData.forEach(movie=>{
  let newMovie = new Movie();
  newMovie._id = mongoose.Types.ObjectId();
  newMovie.Title = movie.Title;
  newMovie.Year = movie.Year;
  newMovie.Runtime = movie.Runtime;
  newMovie.Genre = movie.Genre;
  newMovie.Plot = movie.Plot;
  newMovie.Poster = movie.Poster;
  newMovie.Awards = movie.Awards;


  movie.Actors.forEach(actorName => {
    addPersonToMovie(actorName, newMovie, "Actor");
  })
  
  movie.Director.forEach(directorName => {
    addPersonToMovie(directorName, newMovie, "Director");
  })
  
  movie.Writer.forEach(directorName => {
    addPersonToMovie(directorName, newMovie, "Writer");
  })
  
  allMovies.push(newMovie)

})

mongoose.connect("mongodb://localhost/project", {useNewUrlParser: true});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
  db.dropDatabase(function(err, result){
    if(err){
      console.log("Error dropping database:");
      console.log(err);
      return;
    }
    console.log("Dropped project database. Starting re-creation.");

    users.forEach(user=>{
      let newUser = new User(user);


      newUser.save((error)=>{
        if(error){
          console.error(`Error saving User "${user.username}": ${error.message}`);
        }
      })
    })

    MovieModel.insertMany(allMovies, function(err, result){
  	  if(err){
  		  console.log(err);
  		  return;
  	  }
  	  
      PersonModel.insertMany(allPeople, function(err, result){
    	  if(err){
    		  console.log(err);
    		  return;
    	  }
        console.log("Finished creating 'project' database.")
        mongoose.connection.close();
        process.exit(0); 
      });
    });
  })
});
