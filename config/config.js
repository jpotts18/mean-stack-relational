'use strict';

var nconf = require('nconf'),
    json5 = require('json5'),
    _ = require('lodash'),
    glob = require('glob'),
    path = require('path'),
    fs = require('fs'),
    StandardError = require('standard-error');


var rootPath = path.normalize(__dirname + '/..');

// Load app configuration
var computedConfig = {
    root: rootPath,
    modelsDir : rootPath + '/app/models'
};

//
// Setup nconf to use (in-order):
//   1. Locally computed config
//   2. Command-line arguments
//   3. Some Environment variables
//   4. Some defaults
//   5. Environment specific config file located at './env/<NODE_ENV>.json'
//   6. Shared config file located at './env/all.json'
//
nconf.argv()
    .env(['PORT','NODE_ENV','FORCE_DB_SYNC','forceSequelizeSync'])// Load select environment variables
    .defaults({store:{
            NODE_ENV:'development'
    }});
var envConfigPath = rootPath + '/config/env/'+nconf.get('NODE_ENV')+'.json5';
try{
    if(!fs.statSync(envConfigPath).isFile()){
        throw new Error(); // throw error to trigger catch
    }
}
catch(err){
    throw new StandardError('Environment specific config file not found! Throwing up! (NODE_ENV='
        +nconf.get('NODE_ENV')+')');
}
nconf.file(nconf.get('NODE_ENV'),{ file: envConfigPath, type:'file', format:json5 })
    .file('shared',{ file: rootPath+ '/config/env/all.json5', type:'file', format:json5 })
    .add('base-defaults',{type:'literal', store:{
        PORT:5555
    }})
    .overrides({store:computedConfig});

module.exports = nconf.get();
/**
 * Get files by glob patterns
 */
module.exports.getGlobbedFiles = function(globPatterns, removeRoot) {
	// For context switching
	var _this = this;

	// URL paths regex
	var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

	// The output array
	var output = [];

	// If glob pattern is array so we use each pattern in a recursive way, otherwise we use glob 
	if (_.isArray(globPatterns)) {
		globPatterns.forEach(function(globPattern) {
			output = _.union(output, _this.getGlobbedFiles(globPattern, removeRoot));
		});
	} else if (_.isString(globPatterns)) {
		if (urlRegex.test(globPatterns)) {
			output.push(globPatterns);
		} else {
			glob(globPatterns, {
				sync: true
			}, function(err, files) {
				if (removeRoot) {
					files = files.map(function(file) {
						return file.replace(removeRoot, '');
					});
				}

				output = _.union(output, files);
			});
		}
	}

	return output;
};

/**
 * Get the modules JavaScript files
 */
module.exports.getJavaScriptAssets = function(includeTests) {
	var output = this.getGlobbedFiles(this.assets.lib.js.concat(this.assets.js), 'public/');

	// To include tests
	if (includeTests) {
		output = _.union(output, this.getGlobbedFiles(this.assets.tests));
	}

	return output;
};

/**
 * Get the modules CSS files
 */
module.exports.getCSSAssets = function() {
	var output = this.getGlobbedFiles(this.assets.lib.css.concat(this.assets.css), 'public/');
	return output;
};
