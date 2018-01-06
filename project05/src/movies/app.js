// app.js
const express = require('express');
const app = express();
const db = require('./db');
const mongoose = require('mongoose');
const Movie = mongoose.model('Movie');
const bodyParser = require('body-parser');
const session = require('express-session');
const secretCrypto = require('crypto').randomBytes(64).toString('hex')


const sessionOptions = { 
	secret: secretCrypto, 
	saveUninitialized: false, 
	resave: false
};

app.use(session(sessionOptions));


app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'hbs');


app.get('/movies',(req,res)=>{


	if(Object.keys(req.query).length !== 0){

		const directorName = req.query.director;

		Movie.find({director:{$eq:directorName}},(err,movies,count) => {

			res.render('index',{'movies':movies});
		});


	}

	else {

		Movie.find((err,movies,count) => {

			res.render('index',{'movies':movies});
		});
	}
});

app.get('/movies/add',(req,res)=>{

	res.render('addMovies');

});

app.post('/movies/add',(req,res)=>{

	const body = req.body;

	if(req.session.hasOwnProperty('addMovies')){

		req.session.addMovies.push([body.movieName,body.directorName,body.year]);
	}
	else{

		req.session.addMovies = [[body.movieName,body.directorName,body.year]];
	}
	

	const newMovie = new Movie({'title':body.movieName,'director':body.directorName,'year':body.year});
	
	newMovie.save((err)=>{

		if(err){
			return handleError(err);
		}

	});

	res.redirect('/movies');

	
});


app.get('/mymovies',(req,res)=>{

	res.render('ownMovies',{'addedMovies':req.session.addMovies});


});









app.listen(3000);