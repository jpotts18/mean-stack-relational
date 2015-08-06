var path = require('path'),
    rootPath = path.normalize(__dirname + '/../..');

module.exports = {
	root: rootPath,
	port: process.env.PORT || 3000,
	modelsDir : rootPath + '/app/models',
    forceSequelizeSync: process.env.FORCE_DB_SYNC==='true',
    enableSequelizeLog: true,
    expressSessionSecret: '$uper$ecret$e$$ionKey' // replace with your own
};
