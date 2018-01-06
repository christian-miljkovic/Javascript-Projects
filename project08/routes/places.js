const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Bring in mongoose model, Place, to represent a restaurant
const Place = mongoose.model('Place');

// TODO: create two routes that return json
// GET /api/places
// POST /api/places/create
// You do not have to specify api in your urls
// since that's taken care of in app.js when
// this routes file is loaded as middleware
router.get('/places', (req, res) => {

	//getting querystring
	const query = req.query;

	//check to see the length to determine how we search for the place
	if(Object.keys(query).length > 0){

		//just in case we had spaced querystring come in

		const keys = Object.keys(query);

		for(let i=0;i<keys.length;i++){

			if(keys[i] === 'location'){
				query.location = query.location.split('%').join(' ');
			}
		}

		Place.find(query,(err,place)=>{

			res.send(place);

		});

	}
	else{

		Place.find((err,place)=>{

			res.send(place);

		});		

	}





});

router.post('/places/create', (req, res) => {

	const body = req.body;

	const newPlace = new Place({'name':body.name,'cuisine':body.cuisine,'location':body.location});

	newPlace.save((err)=>{

		if(err){

			res.send({'Error':err});
		}
		else{

			res.send(newPlace);
		}

	});

});

module.exports = router;
