var connectionString = require('./connectionString'),
    environment = require('../utilities/environment'),
    log = require('../logger');

// determine various configuration information from environment such as web.config settings, etc.
module.exports = function (configuration) {
    configuration = configuration || {};
    configuration.auth = configuration.auth || {};
    configuration.logging = configuration.logging || {};
    configuration.logging.level = configuration.logging.level || (environment.debug ? 'debug' : 'info');

    if(!configuration.hasOwnProperty('debug'))
        configuration.debug = environment.debug;

    Object.keys(process.env).forEach(function (key) {
        switch(key.toLowerCase()) {
            case 'sqlazureconnstr_ms_tableconnectionstring':
            case 'ms_tableconnectionstring':
                log.debug('Setting table connection string from environment variable ' + key);
                configuration.data = connectionString.parse(process.env[key]);
                break;

            case 'ema_runtimeurl':
                log.debug('Setting gateway URL from environment variable ' + key);
                configuration.auth.gatewayUrl = process.env[key];
                break;

            case 'ms_signingkey':
                log.debug('Setting signing key from environment variable ' + key);
                configuration.auth.secret = process.env[key];
                break;

            case 'ms_mobileappname':
            case 'ms_mobileservicename':
                log.debug('Setting mobile app name from environment variable ' + key);
                configuration.name = process.env[key];
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