//app.js
const express = require('express');
const app = express();
require('express-static');

app.use(express.static('public'));


app.listen(3000);