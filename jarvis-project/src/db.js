// db.js
const mongoose = require('mongoose') 

// my schema goes here!
const Friend = new mongoose.Schema({
	
	firstName:String,
	lastName:String, 
	birthday:Date 
});


const User = new mongoose.Schema({
	
	firstName:String,
	lastName:String,
	phoneNumber:String, 
	friends:[Friend] 
});



mongoose.model('User', User);
mongoose.model('Friend', Friend);

mongoose.connect('mongodb://cmiljkovic:Dicovich1025!!@ds157325.mlab.com:57325/jarvis-ai');