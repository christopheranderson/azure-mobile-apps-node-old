// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------

// we can expand this to provide different configurations for different environments
var configuration = require('../../../../src/configuration');

if(process.env.MS_TableConnectionString)
    module.exports = configuration.fromEnvironment({}).data;
else
    module.exports = {
        provider: 'sql',
        user: 'azure-mobile-apps-test',
        password: 'Blah1234',
        server: 'localhost',
        database: 'azure-mobile-apps-test'
    };
