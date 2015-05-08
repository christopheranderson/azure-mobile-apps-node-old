module.exports = {
    authenticate: true,                                 // default is false - setting to true will force user to be authenticated (no authorisation)
    softDelete: true,                                   // default is false
    dynamicSchema: false,                               // default is true
    insert: function (item, user, req) {
        req.execute();
    },

    update: function (item, user, req) {
        req.execute();
    },

    delete: function (id, user, req) {
        req.execute();
    },

    read: function (query, user, req) {
        req.execute();
    }
}
