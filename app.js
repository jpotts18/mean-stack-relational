/**
 * Module dependencies.
 */
var express     = require('express');
var fs          = require('fs');
var passport    = require('passport');
var logger      = require('winston');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

//Load configurations

var env             = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config          = require('./config/config');
var auth            = require('./config/middlewares/authorization');
var db              = require('./config/sequelize');

// var passportConfig  = require('./config/passport');
var expressConfig   = require('./config/express');
var routesConfig    = require('./config/routes');


// Create your relational database of choice

//Bootstrap models

//Initialize Passport
// passportConfig.init(passport);

var app = express();

//Initialize Express
// expressConfig.init(app, passport, db);

//Initialize Routes
// routesConfig.init(app, passport, auth);

//Start the app by listening on <port>
var port = process.env.PORT || config.port;
app.listen(port);
console.log('Express app started on port ' + port);

//Initializing logger
// logger.init(app, passport, mongoose);

//expose app
exports = module.exports = app;
