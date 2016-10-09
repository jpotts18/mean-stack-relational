'use strict';

var passport = require('passport'),
    _ = require('lodash');
// These are different types of authentication strategies that can be used with Passport. 
var LocalStrategy = require('passport-local').Strategy,
   FacebookTokenStrategy = require('passport-facebook-token'),
   config = require('./config'),
   db = require('./sequelize'),
   winston = require('./winston');

//Serialize sessions
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    db.User.find({where: {id: id}}).then(function(user){
        if(!user){
            winston.warn('Logged in user not in database, user possibly deleted post-login');
            return done(null, false);
        }
        winston.info('Session: { id: ' + user.id + ', username: ' + user.username + ' }');
        done(null, user);
    }).catch(function(err){
        done(err, null);
    });
});

//Use local strategy
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
    db.User.find({ where: { email: email }}).then(function(user) {
      if (!user) {
        done(null, false, { message: 'Unknown user' });
      } else if (!user.authenticate(password)) {
        done(null, false, { message: 'Invalid password'});
      } else {
        winston.info('Login (local) : { id: ' + user.id + ', username: ' + user.username + ' }');
        done(null, user);
      }
    }).catch(function(err){
      done(err);
    });
  }
));

passport.use(new FacebookTokenStrategy({
        clientID: config.facebook.clientID,
        clientSecret: config.facebook.clientSecret,
        profileFields: ['id', 'first_name', 'last_name', 'email', 'photos']
    }, function (accessToken, refreshToken, profile, done) {

        db.User.find({where : {email: profile.emails[0].value}}).then(function(user){
            if(!user){
                db.User.create({
                    name: profile.name.givenName || '',
                    email: profile.emails[0].value,
                    username: profile.name.givenName || '',
                    provider: 'facebook',
                    facebookUserId: profile.id
                }).then(function(u){
                    winston.info('New User (facebook) : { id: ' + u.id + ', username: ' + u.username + ' }');
                    done(null, u);
                })
            } else {
                winston.info('Login (facebook) : { id: ' + user.id + ', username: ' + user.username + ' }');
                done(null, user);
            }
        }).catch(function(err){
            done(err, null);
        });

    }

));

module.exports = passport;

