module.exports = function (tableConfig) {
    return {
        sql: "SELECT COLUMN_NAME AS name, DATA_TYPE AS type FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = @table AND TABLE_SCHEMA = @schema",
        parameters: [
            { name: 'table', value: tableConfig.name },
            { name: 'schema', value: tableConfig.schema || 'dbo' }
        ]
    }
}