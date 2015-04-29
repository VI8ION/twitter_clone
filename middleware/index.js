
var session  = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('../auth');

module.exports = function(app) {
   app.use(bodyParser.json())   
   app.use(cookieParser());

   app.use(session({
       secret: 'keyboard cat',
       resave: false,
       saveUninitialized: true
   }));

   app.use(passport.initialize());
   app.use(passport.session());
}