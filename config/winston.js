'use strict';

/**
 * Created by Junaid Anwar on 5/28/15.
 */
var winston = require('winston');
var logger = new (winston.Logger)();

logger.add(winston.transports.Console, {
    level: 'verbose',
    prettyPrint: true,
    colorize: true,
    silent: false,
    timestamp: false
});

logger.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};

module.exports = logger;
