'use strict';

/**
 * Module dependencies.
 */
var db = require('../../config/sequelize'),
    request = require('request'),
    qs = require('querystring'),
    config = require('../../config/config'),
    passport = require('passport');

/**
 * Auth callback
 */
exports.authCallback = function (req, res, next) {
    res.redirect('/');
};

/**
 * Show login form
 */
exports.signin = function (req, res) {
    res.render('users/signin', {
        title: 'Signin',
        message: req.flash('error')
    });
};

/**
 * Show sign up form
 */
exports.signup = function (req, res) {
    res.render('users/signup', {
        title: 'Sign up',
    });
};

/**
 * Logout
 */
exports.signout = function (req, res) {
    console.log('Logout: { id: ' + req.user.id + ', username: ' + req.user.username + '}');
    req.logout();
    return res.send({status: 'success', message: 'User logout successfully.'});
};

/**
 * Session
 */
exports.session = function (req, res) {
    return res.send({status: 'success', message: 'User login successfully.'})
    // res.redirect('/');
};

/**
 * Create user
 */
exports.create = function (req, res, next) {
    var message = null;

    var user = db.User.build(req.body);

    user.provider = 'local';
    user.salt = user.makeSalt();
    user.hashedPassword = user.encryptPassword(req.body.password, user.salt);
    console.log('New User (local) : { id: ' + user.id + ' username: ' + user.username + ' }');

    user.save().then(function () {
        req.login(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.send({status: 'success', message: 'User signup successfully.'})
            // res.redirect('/');
        });
    }).catch(function (err) {
        res.render('users/signup', {
            message: message,
            user: user
        });
    });
};

/**
 * Send User
 */
exports.me = function (req, res) {
    res.jsonp(req.user || null);
};

/**
 * Find user by id
 */
exports.user = function (req, res, next, id) {
    db.User.find({where: {id: id}}).then(function (user) {
        if (!user) {
            return next(new Error('Failed to load User ' + id));
        }
        req.profile = user;
        next();
    }).catch(function (err) {
        next(err);
    });
};

/**
 * Generic require login routing middleware
 */
exports.requiresLogin = function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).send('User is not authorized');
    }
    next();
};

/**
 * User authorizations routing middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.profile.id !== req.user.id) {
        return res.status(401).send('User is not authorized');
    }
    next();
};

// function to authenticate and create user
function authenticateSocialUser(profile, done) {
    var searchQuery = {
        email: profile.email
    };
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

exports.facebookUser = function (req, res, next) {

    function sendResponse(err, user, info) {

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
    }

    passport.authenticate('facebook-token', {scope: ['email', 'user_about_me', 'phone']}, sendResponse)(req, res, next);
}

exports.twitterSocialUser = function (req, res) {
    var requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
    var accessTokenUrl = 'https://api.twitter.com/oauth/access_token';
    var profileUrl = 'https://api.twitter.com/1.1/account/verify_credentials.json';

    function sendResponse(err, user, info) {
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

    }

    function getUserProfile(err, response, profile) {
        if (err) {
            return res.send({status: "error", error: err});
        }
        // Step 5a. Link user accounts.
        authenticateSocialUser(profile, sendResponse);

    }

    function verifyAccesToken(err, response, accessToken) {

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
        }, getUserProfile);
    }

    function obtainRequestToken() {
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
    }

    function exchangeOauthToken() {
        var accessTokenOauth = {
            consumer_key: config.twitter.clientID,
            consumer_secret: config.twitter.clientSecret,
            token: req.body.oauth_token,
            verifier: req.body.oauth_verifier
        };
        // Step 3. Exchange oauth token and oauth verifier for access token.
        request.post({url: accessTokenUrl, oauth: accessTokenOauth}, verifyAccesToken);
    }

    // Part 1 of 2: Initial request from Satellizer.
    if (!req.body.oauth_token || !req.body.oauth_verifier) {
        obtainRequestToken();
    } else {
        // Part 2 of 2: Second request after Authorize app is clicked.
        exchangeOauthToken();
    }
}

exports.googleSocailUser = function (req, res) {
    var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
    var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
    var params = {
        code: req.body.code,
        client_id: req.body.clientId,
        client_secret: config.google.clientSecret,
        redirect_uri: req.body.redirectUri,
        grant_type: 'authorization_code'
    };

    function sendResponse(err, user, info) {
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
    }

    function retrivedInfo(err, response, profile) {
        if (profile.error) {
            return res.status(500).send({message: profile.error.message});
        }
        // Authenticate User
        authenticateSocialUser(profile, sendResponse);
    }

    function getAccessToken(err, response, token) {
        var accessToken = token.access_token;
        var headers = {Authorization: 'Bearer ' + accessToken};

        // Step 2. Retrieve profile information about the current user.
        request.get({url: peopleApiUrl, headers: headers, json: true}, retrivedInfo);
    }

    // Step 1. Exchange authorization code for access token.
    request.post(accessTokenUrl, {json: true, form: params}, getAccessToken);
}
