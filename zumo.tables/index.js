var configurationLoader = require('zumo.core/configurationLoader'),
    crudFactory = require('./crud');

module.exports = function (globalConfiguration) {
    var configuration = {};

    return {
        get: crudFactory,
        add: function (tableNameOrPath, definition) {
            if (definition)
                configuration[tableNameOrPath] = definition;
            else
                configurationLoader.loadPath(configuration, tableNameOrPath);
        }
    };
}