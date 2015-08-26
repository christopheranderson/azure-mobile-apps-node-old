// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var connectionString = require('./connectionString'),
    environment = require('../utilities/environment');

// determine various configuration information from environment such as web.config settings, etc.
module.exports = function (configuration) {
    Object.keys(process.env).forEach(function (key) {
        switch(key.toLowerCase()) {
            case 'ms_mobileloglevel':
                configuration.logging.level = process.env[key];
                break;

            case 'sqlconnstr_ms_tableconnectionstring':
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
                process.env[key].split(',').forEach(function (origin) {
                    configuration.cors.origins.push(origin);
                });
                break;

            // case 'customeconnstr_ms_notificationhubconnectionstring':
            // case 'ms_notificationhubconnectionstring':
            //     break;
            //
            // case 'mS_NotificationHubName':
            //     break;
        }
    });

    return configuration;
};
