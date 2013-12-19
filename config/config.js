var _ = require('lodash');

// Load app configuration


// _.merge combines the two objects into a bigger object.
module.exports = _.merge(
	// configuration variables that will be the same across all environments
    require(__dirname + '/../config/env/all.js'),
    // configuration variables that are environment specific
    require(__dirname + '/../config/env/' + process.env.NODE_ENV + '.js') || {}
);
