var express = require('express'),
    tablesFactory = require('zumo.tables');

module.exports = function (configuration) {
    var router = express.Router(),
        tables = tablesFactory(configuration);

    router.route('/tables/:tableName/:id')
        .get(function (req, res, next) {
            var table = tables.get(req.params.tableName),
                promise = req.params.id
                    ? table.readSingle(req.params.id)
                    : table.read(req.query);
        
            promise
                .then(function (resultStream) {
                    res.pipe(resultStream);
                })
                .catch(function (error) {
                    res.status(500);
                    res.end();
                });
        })
        .post(function (req, res, next) {
            // do some stuff
        })
        .patch(function (req, res, next) {

        })
        .delete(function (req, res, next) {

        });
    
    // create a new function so we don't directly expose the router and potentially overlap with properties on express.Router
    var result = function (req, res, next) {
        router(req, res, next);
    };    
    result.add = tables.add;

    return result;
}