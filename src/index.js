var loadConfiguration = require('./configuration'),
    environment = require('./utilities/environment'),
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
        debug: environment.debug,
        version: 'node-' + require('../package.json').version,
        logging: {
            level: environment.debug ? 'info' : 'debug',
            transports: {
                Console: {
                    colorize: true,
                    timestamp: true,
                    showLevel: true
                }
            }
        },
        cors: {
            maxAge: 300,
            origins: ['localhost']
        },
        data: { },
        auth: { }
    };

module.exports = function (configuration) {
    configuration = configuration || {};
    var configFile = path.resolve(configuration.basePath || defaults.basePath, configuration.configFile || defaults.configFile);
    configuration = utilities.assign(loadConfiguration.fromFile(configFile), defaults, configuration);
    loadConfiguration.fromEnvironment(configuration);
    logger.initialise(configuration.logging);

    return platforms[configuration.platform](configuration);
};
