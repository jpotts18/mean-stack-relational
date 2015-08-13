
'use strict';

/**
* Module dependencies.
*/
var passport = require('passport');

module.exports = function(app) {
// User Routes
var users = require('../../app/controllers/users');

// User Routes
app.get('/auth/signout', users.signout);
app.get('/users/me', users.me);

// Setting up the users api
app.post('/auth/signup', users.create);

// Setting the local strategy route
app.post('/auth/signin', passport.authenticate('local', {
}), users.session);

// Setting the facebook oauth routes
app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['email', 'user_about_me'],
}));

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
}), users.oauthCallback('facebook'));

// Setting the twitter oauth routes
app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth/twitter/callback', passport.authenticate('twitter', {
}), users.oauthCallback('twitter'));

// Setting the google oauth routes
app.get('/auth/google', passport.authenticate('google', {
    scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
    ]
}));

app.get('/auth/google/callback', passport.authenticate('google', {
}), users.oauthCallback('google'));

// Finish with setting up the userId param
app.param('userId', users.user);
};
