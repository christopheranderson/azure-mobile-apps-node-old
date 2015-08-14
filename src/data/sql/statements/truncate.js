module.exports = function (table) {
    return {
        sql: 'TRUNCATE TABLE ' + table.name
    }
}
