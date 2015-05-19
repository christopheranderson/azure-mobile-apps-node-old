var auth = require('zumo.auth'),
    logger = require('zumo.core/logger');

module.exports = {
    softDelete: true,
    // declare middleware to execute for all operations - auth.isAuthenticated is a built-in piece of middleware
    pre: auth.isAuthenticated,
    
    // we can just simply pass the execution function
    read: function (query, context) {
        return context.execute().then(function (results) {      // note that this does not support streaming!
            return results.forEach(function (item) {
                item.loaded = new Date();
            });
        });
    },
    
    // we can pass an object containing pre, post and func
    insert: {
        pre: authorise,
        post: log,
        func: function (item, context) {
            return context.execute().then(function () {
                log.debug('New record inserted - ', JSON.stringify(item));
            });
        }
    },
    
    // we can omit the func property to get default behavior with pre and post middleware
    update: {
        pre: authorise,
        post: log
    },
    
    // omitting an operation altogether will result in default behavior
    //delete: {
    //    pre: authorise,
    //    post: log
    //}
}

function authorise(req, res, next) {
    if (!req.user.anonymous)
        next();
    else
        res.status(401).end();
}

function log(req, res, next) {
    logger.debug(req.query);
}

/*
middleware execution order:
read: parseQuery, pre, executeRead(func), post, render
insert: parseEntity, pre, executeInsert(func), post, render
update: parseEntity, pre, executeUpdate(func), post, render
delete: parseId, pre, executeDelete(func), post, render
 */