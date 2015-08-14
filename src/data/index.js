/*
// providers should implement the following:
module.exports = function (configuration) {
    return function (table) {
        return {
            read: function (query) { },
            update: function (item) { },
            insert: function (item) { },
            delete: function (id, version) { },
            truncate: function () { }
        };
    };
};

// where table is an object with the following properties:
var table = {
    name: 'tableName',
    autoIncrement: false,   // not implemented
    dynamicSchema: true,
    idColumn: 'id'          // not implemented
}
*/

module.exports = function (configuration) {
    var provider = (configuration && configuration.data && configuration.data.provider) || 'memory';
    return require('./' + provider)(configuration.data);
}
