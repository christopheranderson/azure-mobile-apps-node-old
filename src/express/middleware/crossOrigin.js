var url = require('url'),
    cors = require('../../cors');

module.exports = function(configuration) {
    if (configuration) {
        cors.initialise(configuration.cors);
    }

    return function(req, res, next) {
        if (configuration && configuration.cors) {
            var origin = req.get('origin');
            var headers = req.get('access-control-request-headers');

            var responseHeaders = cors.getHeaders(origin, headers, req.method);

            Object.keys(responseHeaders).forEach(function(key) {
                res.set(key, responseHeaders[key]);
            });
        }
        next();
    };
};