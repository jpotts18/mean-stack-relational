var pm2 = require('pm2');

var instances = process.env.WEB_CONCURRENCY || 1; // Set by Heroku or 1 (set -1 to scale to max cpu core - 1)
var maxMemory = process.env.WEB_MEMORY || 512;    // 512 is the maximum free Dyno memory on Heroku

pm2.connect(function() {
    pm2.start({
        script    : 'app.js',
        name      : 'msr',                // ----> THESE ATTRIBUTES ARE OPTIONAL:
        exec_mode : 'cluster',               // set to 'cluster' for cluster execution
        instances : instances,
        max_memory_restart : maxMemory + 'M',   // Auto restart if process taking more than XXmo
        env: {                            // If needed declare some environment variables
            "NODE_ENV": "production"
        }
    }, function(err) {
        if (err) return console.error('Error while launching applications', err.stack || err);
        console.log('PM2 and application has been successfully started');

        // Display logs in standard output
        pm2.launchBus(function(err, bus) {
            console.log('[PM2] Log streaming started');

            bus.on('log:out', function(packet) {
                console.log('[App:%s] %s', packet.process.name, packet.data);
            });

            bus.on('log:err', function(packet) {
                console.error('[App:%s][Err] %s', packet.process.name, packet.data);
            });
        });

    });
});

