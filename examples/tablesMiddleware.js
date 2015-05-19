var app = require('express')(),
    zumo = require('zumo')();

// a fully custom approach
app.get('/tables/:tableName/:id', zumo.auth.middleware, customAuth, zumo.tables.prepare, modifyQuery, zumo.tables.fulfillRequest, modifyResults, zumo.tables.render);

// short forms...
zumo.tables.use('tableName');                                           // no modification, request executes with default behaviour
zumo.tables.get('tableName', [customAuth, modifyQuery], modifyResults); // pre and post execution on get request
zumo.tables.post('tableName', customAuth);                              // pre execution on post request



function customAuth(req, res, next) {
    // expect zumo.auth.middleware to have already executed so the req.user property has been set
    if (req.user.isAuthenticated)
        next();
    else
        res.status(401).end();
}

function modifyQuery(req, res, next) {
    // expect zumo.tables.prepare to have already executed so req.tableQuery has been set
    req.query.filter.splice(0, 1);
}

function modifyResults(req, res, next) {
    // expect zumo.tables.fulfillRequest to have already executed so res.results has been set
    res.results.forEach(function (entity) {
        entity.anotherProperty = 'some value';
    });
}



zumo.attach(app);
app.listen(process.env.PORT);
