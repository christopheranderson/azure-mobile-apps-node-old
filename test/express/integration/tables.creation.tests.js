var expect = require('chai').use(require('chai-subset')).expect,
    request = require('supertest-as-promised'),
    config = require('../infrastructure/config').data(),
    express = require('express'),
    mobileApps = require('../../../src/express'),
    data = require('../../../src/data/sql'),
    statements = require('../../../src/data/sql/statements'),
    queries = require('../../../src/query'),
    promises = require('../../../src/utilities/promises'),
    helpers = require('../../../src/data/sql/helpers'),
    table, app, mobileApp;

describe('azure-mobile-apps.express.integration.tables.creation', function () {
    beforeEach(function () {
        app = express();
        mobileApp = mobileApps({ data: config });
    });

    afterEach(function (done) {
        data(config).execute({ sql: 'drop table dbo.' + table.name }).then(done, done);
    });

    it('properly configures tables created via mobileApp.table', function () {
        table = mobileApp.table();
        table.name = 'mobileApp';
        table.columns = { bool: 'boolean', integer: 'number', number: 'number' };
        table.indexes = { foo: ['integer'], bar: ['number', 'integer'] };
        return testTableCreation(table);
    });

    it('properly configures tables created via json object', function () {
        table = {
            name: 'json',
            columns: { integer: 'number' },
            indexes: { index1: ['integer']}
        }
        return testTableCreation(table);
    });

    function testTableCreation (tableConfig) {
        mobileApp.tables.add(tableConfig.name, tableConfig);
        mobileApp.attach(app);

        app.get('/api/createTable', function (req, res, next) {
            req.azureMobile.tables(tableConfig.name).insert({ id: '1', value: 'test1' }).then(function () {
                res.status(200).end();
            });
        });

        app.get('/api/getTableConfig', function (req, res, next) {
            req.azureMobile.data.execute(statements.getIndexes(tableConfig)).then(function (indexes) {
                req.azureMobile.data.execute(statements.getColumns(tableConfig)).then(function (columns) {
                    var config = {
                        columns: helpers.transformColumnInfoToConfig(columns),
                        indexes: helpers.transformIndexInfoToConfig(indexes),
                    };
                    res.status(200).json(config);
                });
            });
        });

        return request(app)
            .get('/api/createTable')
            .expect(200)
            .then(function () {
                return request(app)
                    .get('/api/getTableConfig')
                    .expect(200);
            })
            .then(function (res) {
                expect(res.body.columns).to.containSubset(tableConfig.columns);
                expect(res.body.indexes).to.containSubset(tableConfig.indexes);
            });
    };
});
