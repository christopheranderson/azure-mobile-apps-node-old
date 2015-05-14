var log = require('zumo.core/logger');

module.exports = {
    authenticate: true,                                 // default is false - setting to true will force user to be authenticated (no authorisation)
    softDelete: true,                                   // default is false
    dynamicSchema: false,                               // default is true
    insert: function (item, user, context) {
        log.debug('New record inserted - ', item);
        return context.execute();
    },

    update: function (item, user, context) {
        return context.execute();
    },

    delete: function (id, user, context) {
        return context.execute();
    },

    read: function (query, user, context) {
        return context.execute();
    }
}
