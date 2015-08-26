// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------

// we can expand this to provide different configurations for different environments
var configuration = require('../../../src/configuration');

var config = module.exports = function () {
    return {
        data: config.data(),
        basePath: __dirname
    }
}

config.data = function () {
    if(process.env.MS_TableConnectionString)
        return configuration.fromEnvironment({}).data;

    return {
        provider: 'sql',
        user: 'azure-mobile-apps-test',
        password: 'Blah1234',
        server: 'localhost',
        database: 'azure-mobile-apps-test'
    };
};
