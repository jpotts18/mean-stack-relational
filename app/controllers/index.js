/**
 * Module dependencies.
 */
var _ = require('lodash');


exports.render = function(req, res) {
    res.render('index', {
        user: req.user || null,
        request: req
    });
};
