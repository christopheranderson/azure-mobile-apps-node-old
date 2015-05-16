var fs = require('fs'),
    app = require('express')(),                         // create an express instance
    zumo = require('zumo')({                            // create a zumo instance, passing in global configuration
        appName: 'sample',
        rootPath: '__mobile',
        logging: {
            //userStream: fs.createWriteStream('logs/user.log'),
            //systemStream: fs.createWriteStream('logs/system.log')
        }
    });

// table configuration
zumo.tables.add('./configuration/tables/table1');       // add a module exporting the table configuration
zumo.tables.add('./configuration/tables/');             // add a directory of modules exporting the table configuration

zumo.tables.add('tableName', {                          // add a table configuration inline
    authenticate: true,
    softDelete: true,
    dynamicSchema: false,
    insert: function (item, user, context) {        
        context.execute();
    },
    update: function (item, user, context) { },
    delete: function (id, user, context) { },
    read: function (query, user, context) { }
});


// custom API configuration
zumo.api.add('./configuration/api/api1');               // add a module exporting the API configuration
zumo.api.add('./configuration/api/');                   // add a directory of modules exporting the API configuration

zumo.api.add('apiName', {                               // add an API configuration inline
    authenticate: true,
    post: function (req, res, next) {
        res.write('Hello world!');
    },
    'get': function (req, res, next) { },
    'delete': function (req, res, next) { },
    patch: function (req, res, next) { }
});


// configure express to use all zumo features with supplied configuration
zumo.attach(app);

// alternatively, attach zumo middleware individually
//app.use(zumo.auth.middleware);                        // attach authentication middleware
//app.use(zumo.tables.middleware);                      // attach tables middleware
//app.use(zumo.api.middleware);                         // attach API middleware
//app.use(zumo.push.middleware);                        // attach push middleware
//app.use(zumo.error.middleware);                       // attach push middleware


// start the HTTP server!
app.listen(process.env.PORT || 1337);
