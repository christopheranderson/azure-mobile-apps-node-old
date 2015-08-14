var loader = require('../../configuration/loader'),
    table = require('./table'),
    tableRouter = require('./tableRouter');

module.exports = function (configuration) {
    configuration.tables = configuration.tables || {};

    var router = tableRouter(),
        middleware = function (req, res, next) {
            router(req, res, next);
        };

    // allow configuration of a table by zumoInstance.tables.add('table')
    middleware.add = function (name, definition) {
        if(!definition || !definition.createMiddleware)
            definition = table(definition);
        configuration.tables[name] = definition;
        router.add(name, definition);
    };

    // allow configuration of tables by zumoInstance.tables.import('path/to/config')
    middleware.import = function (path) {
        var tables = loader.loadPath(path, configuration.basePath);
        Object.keys(tables).forEach(function (tableName) {
            var definition = tables[tableName];

            // the default module.exports (i.e. empty file) is an empty object
            // we need to convert this back to undefined for middleware.add
            if(definition && Object.keys(definition).length === 0)
                definition = undefined;

            middleware.add(tableName, definition);
        });
    };

    // expose configuration through zumoInstance.tables.configuration
    middleware.configuration = configuration.tables;

    middleware.stack = router.stack;

    return middleware;
}
