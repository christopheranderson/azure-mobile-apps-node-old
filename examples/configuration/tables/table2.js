module.exports = {
    authenticate: true,
    insert: function (item, user, context) {
        context.execute();
    },

    update: function (item, user, context) {
        context.execute();
    },

    delete: function (id, user, context) {
        context.execute();
    },

    read: function (query, user, context) {
        context.execute();
    }
}
