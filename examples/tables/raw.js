var zumo = require('zumo'),
    tables = zumo.tables,
    logger = zumo.logger;

module.exports = {
    softDelete: true,
    undelete: true,
    
    // the middleware property executes supplied middleware for all operations - tables.execute represents the middleware defined for each operation
    middleware: [tables.execute, log],
    
    // the executeRead function generates middleware that will execute the provided function with a (query, context) signature
    read: tables.executeRead(function (query, context) {
        return context.execute().then(function (results) {
            return results.forEach(function (item) {
                item.loaded = new Date();
            });
        });
    }),
    
    // we can pass an array of middleware to execute
    insert: [authorise, tables.executeInsert(function (item, context) {
        return context.execute().then(function () {
            log.debug('New record inserted - ', JSON.stringify(item));
        });
    })],
    
    // not passing a function to executeXxx will execute the operation with default behaviour
    update: [authorise, tables.executeUpdate(), log]
    
    // omitting an operation altogether will result in default behavior
    //delete: [tables.executeDelete()]
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
