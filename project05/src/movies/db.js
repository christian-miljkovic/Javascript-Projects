// db.js
const mongoose = require('mongoose') 


// my schema goes here!
const MovieSchema = new mongoose.Schema({
	
	title:String,
	director:String,
	year:Number
});

mongoose.model('Movie', MovieSchema);

const Movie = mongoose.model('Movie');




mongoose.connect('mongodb://localhost/hw05');