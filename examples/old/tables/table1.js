var log = require('zumo.core/logger');

module.exports = {
    authorise: true,                                    // default is false - setting to true will force user to be authenticated (no authorisation)
    softDelete: true,                                   // default is false
    dynamicSchema: false,                               // default is true
    insert: function (item, context) {
        authorise(context);
        log.debug('New record inserted - ', item);
        return context.execute();
    },
    
    update: function (item, user, context) {            // to assist with backwards compatibility / migration, providing a function with three arguments
        authorise(context);
        return context.execute();                       // will cause the user object to be passed as the second parameter
    },
    
    delete: function (id, context) {
        if (authorise(context))
            return context.execute();
    },
    
    read: function (query, context) {
        return context.execute().then(function (results) {
        });
    }
};

var router = express.Router();
router.route('/tables/:tableName/:id', function () {
    router.get(zumo.tables.execute);

    router.put(authorise, zumo.tables.execute);
    router.patch(authorise, zumo.tables.execute);
    router.delete(authorise, zumo.tables.execute);
});