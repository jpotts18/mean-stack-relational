'use strict';

/**
 * Module dependencies.
 */
var express     = require('express');
var fs          = require('fs');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Load Configurations
var config          = require('./config/config');
var db              = require('./config/sequelize');
var passport        = require('./config/passport');
var winston         = require('./config/winston');

winston.debug('Accepted Config:',config);

var app = express();

//Initialize Express
require('./config/express')(app, passport);

//Start the app by listening on <port>
app.listen(config.PORT);
winston.info('Express app started on port ' + config.PORT);

//expose app
exports = module.exports = app;
