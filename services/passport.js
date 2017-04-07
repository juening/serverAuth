const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
  //verify this email and pssword, call done with the user if it is correct
  //or call done with false
  User.findOne({ email:email }, function(err, existingUser) {
    if(err) { return done(err); }

    if(!existingUser) {
      return done(null, false);
    }

    //compare password
    existingUser.comparePassword(password, function(err, isMatch) {
      if(err) { return done(err); }
      if(!isMatch) { return done(null, false); }

      return done(null, existingUser);
      //passport will assign the user to req.user for callback func
    });
  });
});

//jwt options
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

//create JWT Strategy, payload is the decoded jwt userid(sub) and iat properties
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  //check if the usr id exist if it does, call done with that user
  // otherwise, call done without a user object
  User.findById(payload.sub, function(err, user) {
    if(err) { return done(err, false); }

    if(user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});


passport.use(jwtLogin);
passport.use(localLogin);
