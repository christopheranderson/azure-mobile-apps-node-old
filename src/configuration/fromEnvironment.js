var connectionString = require('./connectionString'),
    environment = require('../utilities/environment'),
    log = require('../logger');

// determine various configuration information from environment such as web.config settings, etc.
module.exports = function (configuration) {
    configuration = configuration || {};
    configuration.auth = configuration.auth || {};
    configuration.logging = configuration.logging || {};
    configuration.logging.transports = configuration.logging.transports || {
        Console: {
            level: configuration.logging.level || 'info',
            silent: true,
            colorize: true,
            timestamp: true,
            showLevel: true
        }
    }
    configuration.logging.level = configuration.logging.level || 'info';

    if(!configuration.hasOwnProperty('debug'))
        configuration.debug = environment.debug;

    // Delaying configuration of other settings until logger has been initialized
    var pendingConfigurations = [];
    function addConfig(setting, key, apply) {
        pendingConfigurations.push(function () {
            log.debug('Setting ' + setting + ' from environment variable ' + key);
            apply(process.env[key]);  
        });
    }

    Object.keys(process.env).forEach(function (key) {
        switch(key.toLowerCase()) {
            case 'ms_mobileloglevel':
                configuration.logging.level = process.env[key];
                configuration.logging.transports.Console.level = process.env[key];
                configuration.logging.transports.Console.silent = false;
                break;

            case 'sqlazureconnstr_ms_tableconnectionstring':
            case 'ms_tableconnectionstring':
                addConfig('table connection string', key, function (value) {
                    configuration.data = connectionString.parse(value);
                });
                break;

            case 'ema_runtimeurl':
                addConfig('gateway URL', key, function (value) {
                    configuration.auth.gatewayUrl = value;
                });
                break;

            case 'ms_signingkey':
                addConfig('signing key', key, function (value) {
                    configuration.auth.secret = value;
                });
                break;

            case 'ms_mobileappname':
            case 'ms_mobileservicename':
                addConfig('mobile app name', key, function (value) {
                    configuration.name = value;
                });
                break;

            // case 'customeconnstr_ms_notificationhubconnectionstring':
            // case 'ms_notificationhubconnectionstring':
            //     log.debug('Setting notification hub connection string from environment variable ' + key);
            //     break;
            //
            // case 'mS_NotificationHubName':
            //     log.debug('Setting notification hub name from environment variable ' + key);
            //     break;
        }
    });

    log.initialise(configuration.logging);

    pendingConfigurations.forEach(function (apply) {
        apply();
    });

    return configuration;
};
