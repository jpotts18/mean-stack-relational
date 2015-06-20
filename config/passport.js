
var passport = require('passport');
var _ = require('lodash');
// These are different types of authentication strategies that can be used with Passport. 
var LocalStrategy = require('passport-local').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google').Strategy;
var config = require('./config');
var db = require('./sequelize');
var winston = require('./winston');

//Serialize sessions
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    db.User.find({where: {id: id}}).then(function(user){
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

//    Use twitter strategy
passport.use(new TwitterStrategy({
        consumerKey: config.twitter.clientID,
        consumerSecret: config.twitter.clientSecret,
        callbackURL: config.twitter.callbackURL
    },
    function(token, tokenSecret, profile, done) {
        
        db.User.find({where: {twitterUserId: profile.id}}).then(function(user){
            if(!user){
                db.User.create({
                    twitterUserId: profile.id,
                    name: profile.displayName,
                    username: profile.username,
                    provider: 'twitter'
                }).then(function(u){
                    winston.info('New User (twitter) : { id: ' + u.id + ', username: ' + u.username + ' }');
                    done(null, u);
                });
            } else {
                winston.info('Login (twitter) : { id: ' + user.id + ', username: ' + user.username + ' }');
                done(null, user);
            }
        
        }).catch(function(err){
            done(err, null);
        });
    }
));


// Use facebook strategy
passport.use(new FacebookStrategy({
        clientID: config.facebook.clientID,
        clientSecret: config.facebook.clientSecret,
        callbackURL: config.facebook.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {

        db.User.find({where : {facebookUserId: profile.id}}).then(function(user){
            if(!user){
                db.User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    username: profile.username,
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

//Use google strategy
passport.use(new GoogleStrategy({
    returnURL: config.google.callbackURL,
    realm: config.google.realm
  },
  function(identifier, profile, done) {
    console.log(identifier);
    console.log(profile);

    db.User.find({where: {openId: identifier}}).then(function(user){
        if(!user){
            db.User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                username: profile.displayName.replace(/ /g,''),
                openId: identifier, 
            }).then(function(u){
                winston.info('New User (google) : { id: ' + u.id + ', username: ' + u.username + ' }');
                done(null, u);
            })
        } else {
            winston.info('Login (google) : { id: ' + user.id + ', username: ' + user.username + ' }');
            done(null, user);
        }
    }).catch(function(err){
        done(err, null);
    });
  }
));

module.exports = passport;

