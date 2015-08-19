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

    tableName = 'tableCreationTest', 
    table, app, mobileApp;

describe('azure-mobile-apps.express.integration.tables.creation', function () {
    beforeEach(function () {
        app = express();
        mobileApp = mobileApps({ data: config });
    });

    afterEach(function (done) {
        data(config).execute({ sql: 'drop table dbo.' + tableName }).then(done, done);
    });

    it('properly configures tables created via mobileApp.table', function () {
        table = mobileApp.table();
        table.name = tableName;
        table.columns = { bool: 'boolean', integer: 'number', number: 'number' };
        table.indexes = [ ['integer'], ['number', 'integer'] ];
        return testTableCreation(table);
    });

    it('properly configures tables created via json object', function () {
        table = {
            name: tableName,
            columns: { integer: 'number' },
            indexes: ['integer']
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
                        columns: columns,
                        indexes: indexes
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
                expect(transformColumnInfoToConfig(res.body.columns)).to.containSubset(tableConfig.columns);
                expect(transformIndexInfo(res.body.indexes)).to.containSubset(transformIndexConfig(tableConfig.indexes));
            });
    };
});

function transformColumnInfoToConfig(columnInfo) {
    return columnInfo.reduce(function (columns, column) {
        columns[column.name] = helpers.getPredefinedType(column.type);
        return columns;
    }, {});
};

function transformIndexInfo(indexInfo) {
    return indexInfo.map(function (index) {
        return index.index_keys;
    });
};

function transformIndexConfig(config) {
    return config.map(function (index) {
        if (Array.isArray(index)) {
            return index.join(', ');
        } else {
            return index;
        }
    });
};
