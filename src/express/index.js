/**
@module azure-mobile-apps/express
@description Stuff for working with express
*/
var tables = require('./tables'),
    table = require('./tables/table'),
    createContext = require('./middleware/createContext'),
    authenticate = require('./middleware/authenticate'),
    handleError = require('./middleware/handleError'),
    crossOrigin = require('./middleware/crossOrigin'),
    version = require('./middleware/version'),
    log = require('../logger');

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
        /** @prop {Object} tables - Contains functions to register table definitions with azure-mobile-apps */
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
        Attach default azure-mobile-apps middleware to an express application
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

// static exports
module.exports.table = table;
