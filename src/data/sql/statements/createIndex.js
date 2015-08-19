var helpers = require('../helpers');

module.exports = function (tableConfig, columns) {
    var tableName = helpers.formatTableName(tableConfig.schema || 'dbo', tableConfig.name),
        indexName,
        columnsString;

    if (Array.isArray(columns)) {
        indexName = columns.join(',');
        columnsString = columns.map(function (column) {
            return '[' + column + ']';
        }).join(',');
    } else if (typeof columns === 'object') {
        // support index configuration object in future
        throw new Error('Index configuration in table \'' + tableConfig.name + '\' is not an array of strings / arrays of strings.');
    } else {
        indexName = columns;
        columnsString = '[' + columns + ']';
    }

    return {
        sql: 'CREATE INDEX [' + indexName + '] ON ' + tableName + ' (' + columnsString + ')'
    }
}
