'use strict';

var nconf = require('nconf'),
    json5 = require('json5'),
    path = require('path'),
    fs = require('fs'),
    StandardError = require('standard-error');

var rootPath = path.normalize(__dirname + '/..');
var envPath = rootPath + '/config/env/';

try{
    if(!fs.statSync(envPath + 'all.json5').isFile()){
        throw new Error(); // throw error to trigger catch
    }
}
catch(err){
    throw new StandardError('all.json5 config file not found! Throwing up!');
}

var envFiles = fs.readdirSync(envPath);
envFiles = envFiles.filter(function(e){
  return /\.json5$/.test(e) && e !== 'all.json5'
});

var computed = {};
envFiles.forEach(function(e){
    var conf = nconf.file(nconf.get('NODE_ENV'),{ file: envPath + e, type:'file', format:json5 })
      .file('shared',{ file: rootPath+ '/config/env/all.json5', type:'file', format:json5 })
      .add('base-defaults',{type:'literal', store:{
          PORT:5555
      }}).get().db;

    conf.database = conf.name;
    delete conf.name;

    computed[e.substring(0,e.length-6)] = conf;
});

module.exports = computed;
