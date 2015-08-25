/**
@module azure-mobile-apps/express/tables/table
@description Provides helper functions for configuring a table
*/
var middlewareFactory = require('./middlewareFactory'),
    executeOperation = require('../middleware/executeOperation'),
    utilities = require('../../utilities'),
    express = require('express');


module.exports = function (definition) {
    var router = express.Router();

    // calling this creates required middleware as configured
    var table = utilities.assign({
        createMiddleware: function (name) {
            table.name = name;
            return middlewareFactory(table, router, table.operation);
        }
    }, definition);

    table.middleware = { };
    table.operations = { };
    table.execute = router;
    table.operation = executeOperation(table.operations);

    /** Specify middleware to be executed for every request against the table */
    table.use = attachMiddleware('execute');
    table.read = attachOperation('get');
    table.update = attachOperation('patch');
    table.insert = attachOperation('post');
    table.delete = attachOperation('delete');

    return table;

    function attachMiddleware(verb) {
        return function (middleware) {
            table.middleware[verb] = table.middleware[verb] || [];
            Array.prototype.push.apply(table.middleware[verb], arguments);
        };
    }

    function attachOperation(verb) {
        var operation = function (handler) {
            table.operations[verb] = handler;
        };
        operation.use = attachMiddleware(verb);
        return operation;
    }
};
