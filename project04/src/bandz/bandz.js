// bandz.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

//set the app to hbs templating
app.set('view engine', 'hbs');

//set the app to be able to serve static files from the public folder
const publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));

//apply the body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));

//have a global vairbale that holds all of the bands
const bandz = [];

app.get('/',(req,res) => {

	//if the querystring is not empty make the calculations
	if(Object.keys(req.query).length !== 0){

		const genreFilter = req.query.filterGenre;

		const tempBandz = bandz.filter((band) => {

			if(band.genre === genreFilter){

				return band;
			}

		});


		res.render('index',{'bandz':tempBandz});
	}

	else{
		res.render('index',{'bandz':bandz});
	}

});


app.post('/',(req,res)=>{

	const body = req.body;

	const singleBand = {

		'name': body.band,
		'location':body.location,
		'description':body.description,
		'genre':body.genre
	};

	bandz.push(singleBand);

	res.redirect('/');

});









app.listen(3000);
console.log("Listening on port 3000");