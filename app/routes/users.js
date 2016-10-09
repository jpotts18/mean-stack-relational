'use strict';

/**
* Module dependencies.
*/
var passport = require('passport');

module.exports = function(app) {
// User Routes
var users = require('../../app/controllers/users');

// User Routes
app.get('/signout', users.signout);
app.get('/users/me', users.me);

// Setting up the users api
app.post('/users', users.create);

// Setting the local strategy route
app.post('/users/session', passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true
}), users.session);

// Setting the facebook oauth routes
app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['email', 'user_about_me'],
    failureRedirect: '/signin'
}), users.signin);

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/signin'
}), users.authCallback);



    app.post('/auth/facebook/token', function (req, res, next) {

        passport.authenticate('facebook-token', {scope: ['email', 'user_about_me','phone']}, function (err, user, info) {

            if (err) {
                winston.error(err);
                return res.send({status: "error", error: err});
            }
            if (!user) {
                winston.error('User not found error in facebook login! Should not happen finally');
                return res.send({status: "error", error: info});
            }


            req.login(user, function (err) {
                if (err) {

                    winston.error(err);
                    return res.send({status: "error", error: {message: 'Login failed'}});
                }
                return res.send({status: "success", data: {user: user}});
            });


        })(req, res, next);
    });

// Setting the twitter oauth routes
app.get('/auth/twitter', passport.authenticate('twitter', {
    failureRedirect: '/signin'
}), users.signin);

app.get('/auth/twitter/callback', passport.authenticate('twitter', {
    failureRedirect: '/signin'
}), users.authCallback);

// Setting the google oauth routes
app.get('/auth/google', passport.authenticate('google', {
    failureRedirect: '/signin',
    scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
    ]
}), users.signin);

app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/signin'
}), users.authCallback);

// Finish with setting up the userId param
app.param('userId', users.user);
};

