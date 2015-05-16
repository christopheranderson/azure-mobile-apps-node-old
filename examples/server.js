var fs = require('fs'),
    app = require('express')(),                         // create an express instance
    zumo = require('zumo')({                            // create a zumo instance, passing in global configuration
        appName: 'sample',
        rootPath: '__mobile',
        logging: {
            userStream: process.stderr,                 // any stream can be specified for logs, default is stdout
            systemStream: fs.createWriteStream('logs/system.log')
        },
        environments: {
            dev: { rootPath: 'path' },                  // configuration can be specified for individual deployment environments
            test: { rootPath: 'otherPath' },            // any setting can be specified and will override those set in global configuration
            prod: { rootPath: '__mobile' }              // environment will be detected automatically or specified in a process.env (web.config) variable
        }
    });

// table configuration
zumo.tables.add('./configuration/tables/table1');       // add a module exporting the table configuration
zumo.tables.add('./configuration/tables/');             // add a directory of modules exporting the table configuration

zumo.tables.add('tableName', {                          // add a table configuration inline
    authenticate: true,
    softDelete: true,
    dynamicSchema: false,
    insert: function (item, context) {        
        context.execute();
    },
    update: function (item, context) { },
    delete: function (id, context) { },
    read: function (query, context) { }
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
