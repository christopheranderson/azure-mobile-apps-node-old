var helpers = require('../helpers');

module.exports = function (tableConfig, name, columns) {
    var tableName = helpers.formatTableName(tableConfig.schema || 'dbo', tableConfig.name);

    if(!Array.isArray(columns)) {
    	throw new Error('Index \'' + name + '\' in table config should be an array of one or more column names.');
    }

    var columnsString = columns.map(function (column) {
        return '[' + column + ']';
    }).join(',');

    return {
        sql: 'CREATE INDEX [' + name + '] ON ' + tableName + ' (' + columnsString + ')'
    }
}
