var tables = require('./tables'),
    table = require('./tables/table'),
    createContext = require('./middleware/createContext'),
    authenticate = require('./middleware/authenticate'),
    handleError = require('./middleware/handleError'),
    log = require('../logger');

module.exports = function (configuration) {
    configuration = configuration || {};
    configuration.data = configuration.data || { provider: 'memory' };

    var tableMiddleware = tables(configuration),
        authMiddleware = authenticate(configuration),
        createContextMiddleware = createContext(configuration);
        handleErrorMiddleware = handleError(configuration);

    return {
        tables: tableMiddleware,
        table: table,
        auth: authMiddleware,
        configuration: configuration,
        attach: function (app) {
            log.debug('Attaching to express app');
            app.use(createContextMiddleware);
            app.use(authMiddleware);
            app.use(configuration.tableRootPath || '/tables', tableMiddleware);
            app.use(handleErrorMiddleware);
        }
    };
};

// static exports
module.exports.table = table;