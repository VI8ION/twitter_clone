var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs')

var db = require('./db');
var User = db.model('User');

function verify(username, password, done) {   
   User.findOne({ id: username }, function (err, user) {
        if (err) {
            return done(err)
        }

        if (!user) {
            return done(null, false, { message: 'Incorrect username.' })
        }

        bcrypt.compare(password, user.password, function (err, valid){
            if (err) {
                return done(err)
            }

            if (!valid) {
                return done(null, false, { message: 'Incorrect password.' })
            }  

            done(null, user)        
        })        
   });  
}

passport.use(new LocalStrategy(verify));

passport.serializeUser(function(user, done) {
   done(null, user.id);
});

passport.deserializeUser(function(id, done) {
   User.findOne({ id: id }, function (err, user) {
        if (!user) {
            return done(null, false);
        }

        done(null, user);
   });  
});

module.exports = passport;