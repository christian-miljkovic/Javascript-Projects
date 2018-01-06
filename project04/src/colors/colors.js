// colors.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const colorLib = require('./colorlib.js');
const fs = require('fs');
const app = express();

//set the app to hbs templating
app.set('view engine', 'hbs');

//set the app to be able to serve static files from the public folder
const publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));

//apply the body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));

//read in the file containing all of the available color names and hex values
const data = fs.readFileSync('./colors.txt', 'utf8');

//get all of the information in easy to handle format
const colorData = data.split('\n');
const colorArray = [];
colorData.forEach((x) => {colorArray.push(x.split(','));});

//store the data by hexValue: Color object
const colorObj = {};

colorArray.forEach((color) => {

	colorObj[color[1]] = new colorLib.Color(color[0],color[1]);

});



app.get('/',function(req,res){

	res.redirect('/colors');

});

app.get('/colors', function(req,res){


	//store the shades that we will later display
	let shadesArray = [];	

	//if the querystring is not empty make the calculations
	if(Object.keys(req.query).length !== 0){

		const queryString = req.query;
		
		console.log(queryString);

		//getting the colors from the querystring
		const red = +queryString.red;
		const green = +queryString.green;
		const blue = +queryString.blue;
		const total = +queryString.total;

		//check to see if there are errors in the input and render a different page if so
		if(total>10 || total<2 || red>255 || red<0 || green>255 || green<0
			|| blue>255 || blue<0){

			res.render('errorRGB.hbs');
		}

		else {		
			//here we will create the hex so we can access the correct color obj
			//we have to convert to int just because the toString(16) doesn't convert
			//to hex unless its called on a int object and we have to make it uppercase
			//because that is what our hex values in the colors.txt file came as
			let redHex = (red).toString(16).toUpperCase();

			//add the extra zero if neccesary
			if(redHex.length === 1){
				redHex = '0' + redHex;
			}

			let greenHex = (green).toString(16).toUpperCase();

			if(greenHex.length === 1){
					greenHex = '0' + greenHex;
				}

			let blueHex = (blue).toString(16).toUpperCase();


			if(blueHex.length === 1){
				blueHex = '0' + blueHex;
			}

			const colorHex = '#' + redHex + greenHex + blueHex;

			//check to make sure that this color exists in our text file
			if(!colorObj.hasOwnProperty(colorHex)){

				res.render('errorColor');
			}
			else {		

				const color = colorObj[colorHex];

				const tempShadesArray = color.generateShades(total,colorObj);

				shadesArray.push(color);
				shadesArray = shadesArray.concat(tempShadesArray);

				console.log(shadesArray);

				res.render('index',{'shadesArray':shadesArray});
			}
		}
	}

	else{
		res.render('index');
	}
});


app.get('/about',function(req,res){

	res.render('about');

});







app.listen(3000);
console.log('Started listening on port 3000');