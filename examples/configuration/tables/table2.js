module.exports = {
    authenticate: true,
    insert: function (item, context) {
        context.execute();
    },

    update: function (item, context) {
        context.execute();
    },

    delete: function (id, context) {
        context.execute();
    },

    read: function (query, context) {
        context.execute();
    }
}
