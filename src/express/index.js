// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
/**
@module azure-mobile-apps/express
@description Express middleware for working with azure-mobile-apps
*/
var tables = require('./tables'),
    table = require('./tables/table'),
    createContext = require('./middleware/createContext'),
    authenticate = require('./middleware/authenticate'),
    handleError = require('./middleware/handleError'),
    crossOrigin = require('./middleware/crossOrigin'),
    version = require('./middleware/version'),
    log = require('../logger');

/**
Creates an instance of the azure-mobile-apps server object for express 4.x
@param {configuration} configuration
*/
module.exports = function (configuration) {
    configuration = configuration || {};
    configuration.data = configuration.data || { provider: 'memory' };

    var tableMiddleware = tables(configuration),
        authMiddleware = authenticate(configuration),
        createContextMiddleware = createContext(configuration),
        handleErrorMiddleware = handleError(configuration),
        crossOriginMiddleware = crossOrigin(configuration),
        versionMiddleware = version(configuration);

    return {
        /**
        Contains functions to register table definitions with azure-mobile-apps
        @type {module:azure-mobile-apps/express/tables}
        */
        tables: tableMiddleware,

        /**
        Factory function for creating table definition objects
        @function
        @returns {module:azure-mobile-apps/express/tables/table}
        */
        table: table,

        /**
        Top level configuration that azure-mobile-apps was configured with
        @type {configuration}
        */
        configuration: configuration,

        /**
        Attach default azure-mobile-apps middleware to an express application.
        This registers middleware for authentication, push notification and table
        access as well as other required system middleware.
        @param {Express} app Express application to attach to
        */
        attach: function (app) {
            log.debug('Attaching to express app');
            app.use(versionMiddleware);
            app.use(createContextMiddleware);
            app.use(authMiddleware);
            app.use(crossOriginMiddleware);
            app.use(configuration.tableRootPath || '/tables', tableMiddleware);
            app.use(handleErrorMiddleware);
        }
    };
};

/**
Static factory function for creating table definition objects. Intended to be used from imported table configuration files.
@function
@returns {module:azure-mobile-apps/express/tables/table}
@example require('azure-mobile-apps/express').table();
*/
module.exports.table = table;
