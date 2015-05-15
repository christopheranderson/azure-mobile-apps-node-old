var log = require('zumo.core/logger');

module.exports = {
    authenticate: true,                                 // default is false - setting to true will force user to be authenticated (no authorisation)
    softDelete: true,                                   // default is false
    dynamicSchema: false,                               // default is true
    insert: function (item, context) {
        log.debug('New record inserted - ', item);
        return context.execute();
    },

    update: function (item, context) {
        return context.execute();
    },

    delete: function (id, context) {
        return context.execute();
    },

    read: function (query, context) {
        return context.execute();
    }
}
