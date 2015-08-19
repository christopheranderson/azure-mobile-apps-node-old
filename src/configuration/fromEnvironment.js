var connectionString = require('./connectionString'),
    environment = require('../utilities/environment'),
    log = require('../logger');

// determine various configuration information from environment such as web.config settings, etc.
module.exports = function (configuration) {
    configuration = configuration || {};
    configuration.auth = configuration.auth || {};
    configuration.logging = configuration.logging || {};
    configuration.cors = configuration.cors || {};
    configuration.cors.maxAge = configuration.cors.maxAge || 300;
    configuration.cors.origins = configuration.cors.origins || ['localhost'];

    if(!configuration.hasOwnProperty('debug'))
        configuration.debug = environment.debug;

    Object.keys(process.env).forEach(function (key) {
        switch(key.toLowerCase()) {
            case 'ms_mobileloglevel':
                configuration.logging.level = process.env[key];
                break;

            case 'sqlazureconnstr_ms_tableconnectionstring':
            case 'ms_tableconnectionstring':
                configuration.data = connectionString.parse(process.env[key]);
                break;

            case 'ema_runtimeurl':
                configuration.auth.gatewayUrl = process.env[key];
                break;

            case 'ms_signingkey':
                configuration.auth.secret = process.env[key];
                break;

            case 'ms_mobileappname':
            case 'ms_mobileservicename':
                configuration.name = process.env[key];
                break;

            case 'ms_crossdomainwhitelist':
                log.debug('Setting cross domain whitelist from environment variable ' + key);
                process.env[key].split(',').forEach(function (origin) {
                    configuration.cors.origins.push(origin);
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

    return configuration;
};
