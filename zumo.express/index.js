module.exports = function (configuration) {
    var middleware = function (req, res, next) {
        // attach all middleware
    };

    middleware.api = require('./api')(configuration);
    middleware.auth = require('./auth')(configuration);
    middleware.push = require('./push')(configuration);
    middleware.tables = require('./tables')(configuration);

    return middleware;
}