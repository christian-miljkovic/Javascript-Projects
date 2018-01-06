// fansite.js
const App = require('./miniWeb.js').App;
const app = new App();



app.get('/', function(req, res) {
	 	
	res.sendFile('html/index.html');
});

app.get('/home', function(req, res) {

	res.sendFile('html/index.html');
 
});

app.get('/css/base.css', function(req, res) {

	res.sendFile('/css/base.css');
 
});


app.get('/random', function(req, res) {

	res.sendFile('html/random.html');
 
});

app.get('/rando', function(req, res) {

	const rando = Math.floor(Math.random() * 3) + 1;

	console.log(rando);
	const strReq = 'img/lemon'+rando+'.gif';
	res.sendFile(strReq);
 
});

app.get('/lemon1.gif', function(req, res) {
 
	res.sendFile('img/lemon1.gif');

});

app.get('/lemon2.gif', function(req, res) {
 
	res.sendFile('img/lemon2.gif');

});

app.get('/lemon3.gif', function(req, res) {
 
	res.sendFile('img/lemon3.gif');

});



app.get('/about', function(req, res) {

	res.sendFile('html/about.html');
 
});

app.get('/lemonGarb1.gif', function(req, res) {
 
	res.sendFile('img/lemonGarb1.gif');

});

app.get('/public/img/earlHomePage.jpeg', function(req, res) {
 
	res.sendFile('img/earlHomePage.jpeg');

});





app.listen(8080, '127.0.0.1');
