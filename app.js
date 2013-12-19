/**
 * Module dependencies.
 */
var express     = require('express');
var fs          = require('fs');
var passport    = require('passport');
var logger      = require('mean-logger');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

//Load configurations

var env         = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config      = require('./config/config');
var auth        = require('./config/middlewares/authorization');
var Sequelize   = require('sequelize');

// Create your relational database of choice

var db = new Sequelize(config.db.name, config.db.username, config.db.password, {
    dialect : 'sqlite',
    storage : config.db.storage
});

//Bootstrap models

var models_path = __dirname + '/app/models';
var walk = function(path) {
    fs.readdirSync(path).forEach(function(file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
        if (stat.isFile()) {
            if (/(.*)\.(js$|coffee$)/.test(file)) {
                require(newPath)(db);
            }
        } else if (stat.isDirectory()) {
            walk(newPath);
        }
    });
};
walk(models_path);

//bootstrap passport config
require('./config/passport')(passport);

var app = express();

//express settings
require('./config/express')(app, passport, db);

//Bootstrap routes
require('./config/routes')(app, passport, auth);

//Start the app by listening on <port>
var port = process.env.PORT || config.port;
app.listen(port);
console.log('Express app started on port ' + port);

//Initializing logger
logger.init(app, passport, mongoose);

//expose app
exports = module.exports = app;
