var log = require('zumo.core/logger');

module.exports = {
    authenticate: true,                                 // default is false - setting to true will force user to be authenticated (no authorisation)
    softDelete: true,                                   // default is false
    dynamicSchema: false,                               // default is true
    insert: function (item, user, req) {
        log.debug('New record inserted - ', item);
        return req.execute();
    },

    update: function (item, user, req) {
        return req.execute();
    },

    delete: function (id, user, req) {
        return req.execute();
    },

    read: function (query, user, req) {
        return req.execute();
    }
}
