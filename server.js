var connect = require('connect'),
    zumo = require('zumo');

// apply our configuration from the configuration module
require('./configuration');

// start the service!
// zumo will fire up it's own instance of connect and listen on the default port
zumo.start();


// zumo will fire up it's own instance of connect on the specified port
zumo.start(3000);


// start zumo with an existing connect / express / restify instance
var app = connect();
app.use('/', function (req, res, next) { next(); });
zumo.start(app, 3000);


// apply zumo configuration to connect instance without starting
var app = connect();
app.use('/', function (req, res, next) { next(); });
zumo.apply(app);
app.listen(3000);