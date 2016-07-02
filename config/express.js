'use strict';

/**
 * Module dependencies.
 */
var express = require('express');
var flash = require('connect-flash');
var helpers = require('view-helpers');
var compression = require('compression');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var path = require('path');
var sessionMiddleware = require('./middlewares/session');
var config = require('./config');
var winston = require('./winston');

module.exports = function(app, passport) {

    winston.info('Initializing Express');

    app.set('showStackError', true);    
    
    //Prettify HTML
    app.locals.pretty = true;

    //Should be placed before express.static
    app.use(compression({
        filter: function(req, res) {
            return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
        },
        level: 9
    }));

    //Setting the fav icon and static folder
    app.use(favicon(config.root + '/public/img/icons/favicon.ico'));
    app.use(express.static(config.root + '/public'));

    //Don't use logger for test env
    if (config.NODE_ENV !== 'test') {
        app.use(logger('dev', { "stream": winston.stream }));
    }

    //Set views path, template engine and default layout
    app.set('views', config.root + '/app/views');
    app.set('view engine', 'jade');

    //Enable jsonp
    app.enable("jsonp callback");

    //cookieParser should be above session
    app.use(cookieParser());

    // request body parsing middleware should be above methodOverride
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(methodOverride());

    //express session configuration
    app.use(sessionMiddleware);

    //connect flash for flash messages
    app.use(flash());

    //dynamic helpers
    app.use(helpers(config.app.name));

    //use passport session
    app.use(passport.initialize());
    app.use(passport.session());

    // Globbing routing files
    config.getGlobbedFiles('./app/routes/**/*.js').forEach(function(routePath) {
      require(path.resolve(routePath))(app);
    });

    app.get('*',  function (req, res, next) {
            res.render('index');
    });

    app.use('*',function(req, res){
        res.status(404).render('404', {
            url: req.originalUrl,
            error: 'Not found'
        });
    });

    app.use(function(err, req, res, next) {

        //Log it
        winston.error(err);

        //Error page
        res.status(500).render('500', {
            error: err.stack
        });
    });

};
