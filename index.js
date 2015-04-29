var _ = require('lodash')
,   express = require('express')
,   app = express()
,   config = require('./config')

require('./middleware')(app)
require('./router')(app)
console.log(config.get('server:port'))
var server = app.listen(config.get('server:port'), config.get('server:host'), function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('app listening at http://%s:%s', host, port);
});

module.exports = server