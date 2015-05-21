var fs = require('fs'),
    app = require('express')(),                         // create an express instance
    zumo = require('zumo')({                            // create a zumo instance, passing in global configuration
        appName: 'sample',
        rootPath: '__mobile',
        environments: {                                 // configuration can be specified for individual deployment environments
            dev: { logStream: process.stderr, },        // any setting can be specified and will override those set in global configuration
            test: { logStream: fs.createWriteStream('logs/zumo.log') },
            prod: { rootPath: '__mobile' }              // environment will be detected automatically or specified in a process.env (web.config) variable
        }
    });

// table configuration
zumo.tables.import('./configuration/tables/table1');    // import a module exporting the table configuration
zumo.tables.import('./configuration/tables/');          // import a directory of modules exporting the table configuration

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


// configure express to use all zumo features with supplied configuration
zumo.attach(app);

// alternatively, attach zumo middleware individually
//app.use(zumo.auth.middleware);                        // attach authentication middleware
//app.use(zumo.tables.middleware);                      // attach tables middleware
//app.use(zumo.api.middleware);                         // attach API middleware
//app.use(zumo.push.middleware);                        // attach push middleware
//app.use(zumo.error.middleware);                       // attach error middleware


// start the HTTP server!
app.listen(process.env.PORT || 1337);
