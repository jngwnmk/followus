// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var User            = require('../model/user');

var BasicStrategy = require('passport-http').BasicStrategy;

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'cellphone',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, cellphone, password, done) { // callback with email and password from our form
        
        console.log(cellphone + " : " +password);
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'cellphone' :  cellphone }, function(err, user) {
            // if there are any errors, return the error before anything else
            console.log("error: "+err);
            console.log("user:" +user);
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user);
        });

    }));
    
    passport.use(new BasicStrategy(
      function(cellphone, password, callback) {
        User.findOne({ cellphone: cellphone }, function (err, user) {
          if (err) { return callback(err); }
    
          // No user found with that username
          if (!user) { return callback(null, false); }
    
          // Make sure the password is correct
          user.verifyPassword(password, function(err, isMatch) {
            if (err) { return callback(err); }
    
            // Password did not match
            if (!isMatch) { return callback(null, false); }
            // Success
            console.log('success');
            return callback(null, user);
          });
        });
      }
    ));
    
    passport.use('basic-admin', new BasicStrategy(
       function(cellphone, password, callback) {
        User.findOne({ cellphone: cellphone }, function (err, user) {
          if (err) { return callback(err); }
    
          // No user found with that username
          if (!user) { return callback(null, false); }
    
          // Make sure the password is correct
          user.verifyPassword(password, function(err, isMatch) {
            if (err) { return callback(err); }
    
            // Password did not match
            if (!isMatch) { return callback(null, false); }
            
            // Success
            if(!user.isAdmin()){
                return callback(null, false);
            }
            
            console.log('success');
            return callback(null, user);
          });
        });
      }
      ));
    
    
    
    
};