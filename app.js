const express = require("express");
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 8000;
require('dotenv').config();

const homeRouter = require('./routes/index')
const retailerRouter  = require('./routes/retailer');
const supplierRouter = require('./routes/supplier');


//Bodyparser
app.use(express.urlencoded({
    extended: false
}));

app.set('view engine', 'ejs');


// Routes
app.use('/', homeRouter);
app.use('/retailer', retailerRouter);
app.use('/supplier', supplierRouter);

// Make static uses
app.use(express.static(__dirname + '/public'));


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// parse application/json
app.use(bodyParser.json());

app.listen(port, () => console.log(`Server started listening on port: ${port}`));