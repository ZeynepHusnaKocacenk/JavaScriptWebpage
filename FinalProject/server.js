/*
	Zeynep Kocacenk ID: 101146323
	Cemile Sogut	ID: 101169792
	credit: We have used the knowledge we had from the tutorial, workshop, and lecture example codes.
*/

//const { request } = require('express');
const session = require("express-session");
const User = require("./UserModel");
const path = require("path");
const express = require('express');
const pug = require('pug');
let app = express();
const port = 3000;


let mongo = require('mongodb');
const MovieModel = require("./MovieModel");
const { response } = require("express");
let MongoClient = mongo.MongoClient;
let db;

app.use(
session({
	cookie: {
		maxAge: 500000000
	},
	secret: "some secret key here",
	resave: true, // saves session after every request
	saveUninitialized: false, // stores the session if it hasn't been stored
})
);

app.set("view engine", "pug");

app.use(express.static("public"));

app.use("/app", auth, express.static(path.join(__dirname, "private")));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

//MOVIES
app.route("/movies")
.get((request,response)=>{
	let query = {};
	let params = [];
	for(let q in request.query){
		if(q=="page"){
			continue;
		}
		params.push(q+"="+request.query[q]);
	}
	request.qstring = params.join("&");

	try{
		request.query.page = request.query.page || 1;
		request.query.page = Number(request.query.page);
		if(request.query.page < 1){
			request.query.page = 1;
		}
	}catch{
		request.query.page = 1;
	}

	if (request.query.title){
		query["Title"] = {$regex : request.query.title, $options: "i"}
	}
	if (request.query.genre){
		query["Genre"] = {$regex : request.query.genre, $options: "i"}
	}
	if (request.query.actorName){
		query["Actor"] = {$regex : request.query.actorName, $options: "i"}
	}


	db.collection("movies")
	.find(query)
	.limit(10)
	.skip((request.query.page-1)*10)
	.toArray(function(err,results){
		if (err) throw err;
		response.status(200);
		response.render("pages/movies", {movies:results, qstring: request.qstring, current: request.query.page});
	})
})
.post((request, response) =>{

	if(!request.session.loggedin){
		response.status(400).send("Login to add a movie!.");
		return;
	}
	
	console.log("request received", request.body);
	let newMovie = {
		type: "movie",
		...request.body,
	};
	db.collection("movies").insertOne(newMovie, (err, data)=>{
		if(err){
			console.log("could not insert")
			throw err;
		}
		console.log("inserted")
		response.sendStatus(201);
	});
});

app.get("/movies/:id", (request,response)=>{
	let oid;
	try{
		oid = new mongo.ObjectID(request.params.id);
	}catch{
		response.status(404).send("Unknown ID");
		return;
	}
	db.collection("movies").findOne({"_id":oid}, function(err,result){
		if(err){
			response.status(500).send("Error reading database.");
			return;
		}
		if(!result){
			response.status(404).send("Unknown ID");
			return;
		}
		response.status(200)
		response.send(pug.renderFile('./views/pages/movie.pug', {movie: result}));
	})
})

app.post("/movies/:id",(request,response)=>{
	if(!request.session.loggedin){
		response.status(400).send("Log in to add a review.");
		return;
	}
	console.log(request.params.id)
	console.log(request.body)
	response.redirect(`${request.params.id}/reviews`)
})


//PEOPLE
app.post("/people",(request, response) =>{
	if(!request.session.loggedin){
		// console.log("You are not logged in. You cannot add!");
		response.status(400).send("You cant ADD!.");
		return;
	}
	console.log("request received", request.body);
	let newActor = {
		...request.body,
	};
	db.collection("users").findOne({ "username" : request.session.username}, function(err, result) {
		if(err) throw err;
		
		console.log(result);


		response.status(200);
		if(result.admin == true){
			db.collection("people").insertOne(newActor, (err, data)=>{
				if(err){
					console.log("could not insert")
					throw err;
				}
				console.log("inserted")
				response.sendStatus(201);
			});
		}else if(result.admin == false){
			response.sendStatus(401);
		}
	})
	
});

app.get("/people/:id", (request,response)=>{
	let oid;
	try{
		oid = new mongo.ObjectID(request.params.id);
	}catch{
		response.status(404).send("Unknown ID at try");
		return;
	}
	db.collection("people").findOne({"_id":oid}, function(err, result){
		if(err){
			response.status(500).send("Error reading database.");
			return;
		}
		if(!result){
			response.status(404).send("Unknown ID");
			return;
		}
		response.status(200)
		response.send(pug.renderFile('./views/pages/people.pug', {person: result}));
	});
})

//USERS

app.get("/users/:id", (request,response)=>{
	if(!request.session.loggedin){
			response.send(pug.renderFile('./views/pages/signInUp.pug', {}));
			return;
	}
	
	let oid;
	try{
		oid = new mongo.ObjectID(request.params.id);
	}catch{
		response.status(404).send("Unknown ID at try");
		return;
	}
	db.collection("users").findOne({"_id":oid}, function(err, result){
		if(err){
			response.status(500).send("Error reading database.");
			return;
		}
		if(!result){
			response.status(404).send("Unknown ID");
			return;
		}
		response.status(200)
		response.send(pug.renderFile('./views/pages/profile.pug', {person: result}));
	});



	console.log("requestin username is: ",request.session.username)

	db.collection("movies").find().limit(5).toArray((err,results)=>{
		const movies = results;
		db.collection("users").findOne({ "username" : request.session.username}, function(err, result) {
			if(err) throw err;
			response.status(200);
			response.send(pug.renderFile('./views/pages/profile.pug', {user: result, movies: movies}))
		})
	})	
})

// app.post("/users/",(request, response) =>{
// 	if(!request.session.loggedin){
// 		// console.log("You are not logged in. You cannot add!");
// 		response.status(400).send("You are not logged in!");
// 		// res.redirect(`/users/:${session}`)
// 		return;
// 	}
	
// 	db.collection("people").insertOne(newActor, (err, data)=>{
// 		if(err){
// 			console.log("could not insert")
// 			throw err;
// 		}
// 		console.log("inserted")
// 		response.sendStatus(201);
// 	});
// });



//OTHER
app.get("/", (request,response)=>{
	db.collection("movies").find().limit(5).toArray((err,results)=>{
		const movies = results;
		response.status(200);
		response.send(pug.renderFile('./views/pages/index.pug', {movies}))
	})
})

app.get("/search", (request,response)=>{
		response.status(200);
		response.render("pages/search");
})

app.get("/profile", (request,response)=>{
	if(!request.session.loggedin){
		response.send("you need to log in first")
		response.render('pages/signInUp')
		return;
	}
	db.collection("users").findOne({"username":request.session.username}, function(err, result){
		response.status(200).send(pug.renderFile('views/pages/profile.pug', {user: result}));
	})
})

app.route("/contribute")
.get((request,response)=>{
	response.status(200);
	response.send(pug.renderFile('./views/pages/contribute.pug'));
})

app.get("/signInUp", (request,response)=>{
	if(request.session.loggedin){
		response.status(200).send("Already logged in.");
		return;
	}
	response.status(200);
	response.send(pug.renderFile('./views/pages/signInUp.pug'));
});

app.post("/signIn", login);

app.post("/signInUp", login);

app.post("/signUp", signUp);

app.get("/logout", logout);

//FUNCTIONS
function auth(request, res, next) {
	if (!request.session.loggedin) {
	  return res.redirect("/signInUp");
	}

	if (!users[request.session.username].admin) {
	  return res.status(401).send("Unauthorized");
	}

	next();
}

function login(req, res, next) {
	if (req.session.loggedin) {
	  res.status(200).send("Already logged in.");
	  return;
	}

	let username = req.body.username;
	let password = req.body.password;

	console.log("Logging in with credentials:");
	console.log("Username: " + username);
	console.log("Password: " + password);

	db.collection("users").findOne({"username":username, "password":password}, function(err, result){
		if(err){
			res.status(500).send("Error reading database.");
			return;
		}
		if(!result){
			res.status(404).send("username or password incorrect");
			return;
		}
		req.session.loggedin = true;
		req.session.username = result.username;
		res.status(200).send(pug.renderFile('views/pages/profile.pug', {user: result}));
	})
}

function signUp(req, res, next){
	let newUser = req.body;

	if(newUser.username == null || newUser.password == null){
		res.status(300).redirect("/signInUp");
	}

	db.collection("users").findOne({ username: newUser.username }, function(err, result) {
		if( result == null ) {
			console.log("it does not exists");
			let createdUser = new User(newUser);
			db.collection("users").insertOne(createdUser);
			res.redirect("/profile")
			return;
		}
		if(result) {
			res.status(200).send("The username already exists! Use different username");
		}
	})
}

app.post("/saveAccountType", (request, response) =>{

	// User.find().select("admin")
	console.log(request.body);
	if(request.body.aType === "contributing"){
		console.log("you have requested contributing type");
		db.collection("users").findOneAndUpdate({username: request.session.username}, {$set: {admin: true}}, {new: true}, (err, result)=>{
			if(err) throw err;
			
			console.log("The update result:");
			console.log(result);

			response.redirect("/profile");
			// response.status(200).send(pug.renderFile('./views/pages/profile.pug', {user: result}));
		})
		
	}
	if(request.body.aType ==="regular"){
		console.log("you have requested regular type");
		db.collection("users").findOneAndUpdate({username: request.session.username}, {$set: {admin: false}}, {new: true}, (err, result)=>{
			if(err) throw err;
			console.log("The update result:");
			console.log(result);
			
			response.redirect("/profile");
			// response.status(200).send(pug.renderFile('./views/pages/profile.pug', {user: result}));
		});
	}
	response.status(200);
	return;
	
});

function logout(request, response){
	request.session.destroy();
	response.redirect("/signInUp");
}

// app.put("/users/:userId/watchlist/:movieId", (request, response, next)=>{
// 	const filter = {_id: request.params.UserId};
// 	const update = {"$push": {"Watchlist ": request.params.movieId}};
// 	User.findOneAndUpdate(filter, update, {new: true}, (err, result)=>{
// 		console(result);
// 	})
// })

MongoClient.connect("mongodb://localhost:27017/", function(err,client){
	if(err) throw err;
	db = client.db("project");

	//Start server
	app.listen(port);
	console.log(`Server listening at http://localhost:${port}`);
})
