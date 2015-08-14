var loadConfiguration = require('./configuration'),
    logger = require('./logger'),
    utilities = require('./utilities'),
    path = require('path'),

    platforms = {
        express: require('./express'),
    },

    defaults = {
        platform: 'express',
        basePath: path.dirname(module.parent.filename),
        configFile: 'azureMobile',
        promiseConstructor: Promise,
        tableRootPath: '/tables',
        data: { }
    };

module.exports = function (configuration) {
    configuration = configuration || {};
    var configFile = path.resolve(configuration.basePath || defaults.basePath, configuration.configFile || defaults.configFile);
    configuration = utilities.assign(loadConfiguration.fromFile(configFile), defaults, configuration);
    loadConfiguration.fromEnvironment(configuration);
    logger.initialise(configuration.logging);

    return platforms[configuration.platform](configuration);
};
