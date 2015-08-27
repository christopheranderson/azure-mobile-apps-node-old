// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------

// we can expand this to provide different configurations for different environments
var configuration = require('../../../../src/configuration'),
    path = require('path');

if(process.env.MS_TableConnectionString)
    module.exports = configuration.fromEnvironment({}).data;
else
    module.exports = require('../../../config').data;
