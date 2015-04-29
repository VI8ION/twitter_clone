var nconf = require('nconf')
  , path = require('path');

nconf.env();

var APP_ENV = nconf.get('NODE_ENV') || 'dev';

var configFile = 'config-' + APP_ENV + '.json';

nconf.file(path.join(__dirname, configFile));

module.exports = nconf;