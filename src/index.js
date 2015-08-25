/**
The azure-mobile-apps module is the Nodejs implementation of Azure Mobile Apps
@module azure-mobile-apps
*/

﻿var loadConfiguration = require('./configuration'),
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
            level: environment.debug ? 'debug' : 'info',
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

/**
Creates an instance of the azure-mobile-apps server object for the platform specified in the configuration
@param {configuration} configuration
*/
module.exports = function (configuration) {
    configuration = configuration || {};
    var configFile = path.resolve(configuration.basePath || defaults.basePath, configuration.configFile || defaults.configFile);
    configuration = utilities.assign(loadConfiguration.fromFile(configFile), defaults, configuration);
    loadConfiguration.fromEnvironment(configuration);
    logger.initialise(configuration.logging);

    return platforms[configuration.platform](configuration);
};
