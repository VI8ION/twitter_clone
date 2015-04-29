var mongoose = require('mongoose');
var config = require('../config');

var userSchema = require('./schemas/user');
var tweetSchema = require('./schemas/tweet');

var connection = mongoose.createConnection(config.get('database:host'), 
	                                       config.get('database:name'), 
	                                       config.get('database:port'));

connection.model('User', userSchema, 'users');
connection.model('Tweet', tweetSchema, 'tweets');

module.exports = connection;