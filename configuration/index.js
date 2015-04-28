// an example of how we ideally want to be able to configure the node runtime
var zumo = require('zumo');

// global configuration - these will be set from defaults and settings passed in from iisnode
zumo.configure({                                            // pass in an object to merge with existing configuration
    applicationName: 'mobileApp',
    applicationKey: 'applicationKey',
    masterKey: 'masterKey',
    routeBase: '__mobile',
    requireHttps: true
})

zumo.configure('appName', 'mobileApp');                     // set individual settings

var globalConfiguration = zumo.configure(),                 // get all settings
    appNameSetting = zumo.configure('appName');             // get single setting

// tables
zumo.tables.configure('tablename', {                        // configure table inline
    insert: function (item, user, req) {
        req.execute();
    }, // alias ins, create, put
    
    update: function (item, user, req) {
        req.execute();
    }, // alias upd, patch
    
    delete: function (id, user, req) {
        req.execute();
    }, // alias del
    
    read: function (query, user, req) {
        req.execute();
    } // alias query, get
});

zumo.tables.configure('tablename', './table');              // configure a single table module
zumo.tables.configure('../tables/');                        // configure all table modules in a folder


// custom APIs
zumo.api.configure('apiName', {                             // configure API inline
    post: function (req, res, next) {
        res.write('Hello world!');
    },
    get: function (req, res, next) {  
    
    },
    delete: function (req, res, next) {  
    
    },
    patch: function (req, res, next) {  
    
    }
});

zumo.api.configure('apiName', './api');                     // configure a single API module
zumo.api.configure('../api/');                              // configure all API modules in a folder