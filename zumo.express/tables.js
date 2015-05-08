var express = require('express'),
    zumo = require('zumo.tables');

module.exports = function (configuration) {
    var router = express.Router(),
        tables = zumo(configuration);

    router.route('/tables/:tableName/:id')
        .get(function (req, res, next) {
            if(req.params.id)
                tables.readSingle(req.params.tableName, req.params.id)
                    .then(function (entity) {
                        res.send(JSON.stringify(entity));
                    });
            else
                tables.read(req.params.tableName, req.query)
                    .then(function (resultStream) {
                        res.pipe(resultStream);
                    });
        })
        .post(function (req, res, next) {
            // do some stuff
        })
        .patch(function (req, res, next) {

        })
        .delete(function (req, res, next) {

        });
    
    return router;
}