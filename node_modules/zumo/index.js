var platforms = {
    express: require('zumo.express'),
    restify: require('zumo.restify')
};

module.exports = function (configuration) {
    configuration = configuration || {};

    // by default, return the express middleware implementation
    return platforms[configuration.platform || 'express'](configuration);
};
