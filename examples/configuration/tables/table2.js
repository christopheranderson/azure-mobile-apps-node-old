module.exports = {
    authenticate: true,
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
