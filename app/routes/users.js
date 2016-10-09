'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
    db = require('../../config/sequelize'),
    request = require('request'),
    qs = require('querystring'),
    config = require('../../config/config');


module.exports = function (app) {
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


    // Setting social authentication routes

// Setting the facebook oauth route

    app.post('/auth/facebook/token', function (req, res, next) {

        passport.authenticate('facebook-token', {scope: ['email', 'user_about_me', 'phone']}, function (err, user, info) {

            if (err) {

                return res.send({status: "error", error: err});
            }
            if (!user) {
                return res.send({status: "error", error: info});
            }
            req.login(user, function (err) {
                if (err) {
                    return res.send({status: "error", error: {message: 'Login failed'}});
                }
                return res.send({status: "success", data: {user: user}});
            });


        })(req, res, next);
    });
    // function to authenticate and create user
    function authenticateUser(profile, done) {
        var searchQuery = {
            email: profile.email
        }
        if (profile.name) {
            searchQuery = {
                twitterKey: profile.id
            }
        }

        db.User.find({where: searchQuery}).then(function (user) {

            if (!user) {
                var userObj = {};
                if (profile.name) {
                    userObj = {
                        name: profile.name || '',
                        username: profile.name || '',
                        provider: 'twitter',
                        twitterKey: profile.id,
                        email: profile.id + "@twitter.com"
                    }
                } else {
                    userObj = {
                        name: profile.given_name || '',
                        email: profile.email,
                        username: profile.given_name || profile.name || '',
                        provider: 'google',
                        googleUserId: profile.sub
                    };
                }
                db.User.create(userObj).then(function (u) {
                    done(null, u);
                })
            } else {
                done(null, user);
            }
        }).catch(function (err) {
            done(err, null, err);
        });


    }

    app.post('/auth/google', function (req, res) {
        var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
        var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
        var params = {
            code: req.body.code,
            client_id: req.body.clientId,
            client_secret: config.google.clientSecret,
            redirect_uri: req.body.redirectUri,
            grant_type: 'authorization_code'
        };

        // Step 1. Exchange authorization code for access token.
        request.post(accessTokenUrl, {json: true, form: params}, function (err, response, token) {
            var accessToken = token.access_token;
            var headers = {Authorization: 'Bearer ' + accessToken};

            // Step 2. Retrieve profile information about the current user.
            request.get({url: peopleApiUrl, headers: headers, json: true}, function (err, response, profile) {
                if (profile.error) {
                    return res.status(500).send({message: profile.error.message});
                }
                // Authenticate User
                authenticateUser(profile, function (err, user, info) {
                    if (err) {

                        return res.send({status: "error", error: err});
                    }
                    if (!user) {
                        return res.send({status: "error", error: info});
                    }
                    req.login(user, function (err) {
                        if (err) {
                            return res.send({status: "error", error: {message: 'Login failed'}});
                        }
                        return res.send({status: "success", data: {user: user}});
                    });

                });
            });
        });
    });

    // Setting the twitter oauth route
    app.post('/auth/twitter', function (req, res) {
        var requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
        var accessTokenUrl = 'https://api.twitter.com/oauth/access_token';
        var profileUrl = 'https://api.twitter.com/1.1/account/verify_credentials.json';

        // Part 1 of 2: Initial request from Satellizer.
        if (!req.body.oauth_token || !req.body.oauth_verifier) {
            var requestTokenOauth = {
                consumer_key: config.twitter.clientID,
                consumer_secret: config.twitter.clientSecret,
                callback: req.body.redirectUri
            };
            // Step 1. Obtain request token for the authorization popup.
            request.post({url: requestTokenUrl, oauth: requestTokenOauth}, function (err, response, body) {
                var oauthToken = qs.parse(body);
                // Step 2. Send OAuth token back to open the authorization screen.
                res.send(oauthToken);
            });
        } else {
            // Part 2 of 2: Second request after Authorize app is clicked.
            var accessTokenOauth = {
                consumer_key: config.twitter.clientID,
                consumer_secret: config.twitter.clientSecret,
                token: req.body.oauth_token,
                verifier: req.body.oauth_verifier
            };

            // Step 3. Exchange oauth token and oauth verifier for access token.
            request.post({url: accessTokenUrl, oauth: accessTokenOauth}, function (err, response, accessToken) {

                accessToken = qs.parse(accessToken);

                var profileOauth = {
                    consumer_key: config.twitter.clientID,
                    consumer_secret: config.twitter.clientSecret,
                    token: accessToken.oauth_token,
                    token_secret: accessToken.oauth_token_secret,
                };

                // Step 4. Retrieve user's profile information and email address.
                request.get({
                    url: profileUrl,
                    qs: {include_email: true},
                    oauth: profileOauth,
                    json: true
                }, function (err, response, profile) {
                    if (err) {
                        return res.send({status: "error", error: err});
                    }
                    // Step 5a. Link user accounts.
                    authenticateUser(profile, function (err, user, info) {
                        if (err) {
                            return res.send({status: "error", error: err});
                        }
                        if (!user) {
                            return res.send({status: "error", error: info});
                        }

                        req.login(user, function (err) {
                            if (err) {
                                return res.send({status: "error", error: {message: 'Login failed'}});
                            }
                            return res.send({status: "success", data: {user: user}});
                        });

                    });

                });
            });
        }
    });

    // Finish with setting up the userId param
    app.param('userId', users.user);


};

