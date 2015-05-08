var app = require('express')(),                         // create an express instance
    zumo = require('zumo')({                            // create a zumo instance, passing in global configuration
        appName: 'sample',
        applicationUrl: 'http://overridden-application-url.azurewebsites.net/',
        gatewayUrl: 'http://overridden-gateway-url.azurewebsites.net/'
    });

// table configuration
zumo.tables.add('./configuration/tables/table1');       // add a module exporting the table configuration
zumo.tables.add('./configuration/tables/');             // add a directory of modules exporting the table configuration

zumo.tables.add('tableName', {                          // add a table configuration inline
    authenticate: true,
    softDelete: true,
    dynamicSchema: false,
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
});


// custom API configuration
zumo.api.add('./configuration/tables/table1');          // add a module exporting the API configuration
zumo.api.add('./configuration/tables/');                // add a directory of modules exporting the API configuration

zumo.api.add('apiName', {                               // add an API configuration inline
    authenticate: true,
    post: function (req, res, next) {
        res.write('Hello world!');
    },
    get: function (req, res, next) { },
    delete: function (req, res, next) { },
    patch: function (req, res, next) { }
});


// configure express to use all zumo features with supplied configration
app.use(zumo);

// alternatively, attach zumo middleware individually
app.use(zumo.auth);                                     // attach authentication middleware
app.use(zumo.tables);                                   // attach tables middleware
app.use(zumo.api);                                      // attach API middleware
app.use(zumo.push);                                     // attach push middleware


// start the HTTP server!
app.listen(process.env.PORT);