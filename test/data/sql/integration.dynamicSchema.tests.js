var config = require('./infrastructure/config'),
    dynamicSchema = require('../dynamicSchema')(config),
    statements = require('../statements'),
    execute = require('../execute'),
    expect = require('chai')
                .use(require('chai-subset'))
                .use(require('chai-as-promised'))
                .expect,
    queries = require('azure-mobile-apps.query'),
    promises = require('azure-mobile-apps.core/promises'),
    table = { name: 'dynamicSchema' };

describe('azure-mobile-apps.data.sql.integration.dynamicSchema', function () {
    afterEach(function (done) {
        execute(config, { sql: 'drop table dbo.dynamicSchema' }).then(done, done);
    });

    it("creates basic table schema", function () {
        var item = { id: '1' };
        return dynamicSchema.execute(table, statements.insert(table, item), item)
            .then(function () {
                return execute(config, statements.getColumns(table));
            })
            .then(function (columns) {
                expect(columns).to.deep.equal([
                    { name: 'id', type: 'nvarchar' },
                    { name: '__version', type: 'timestamp' },
                    { name: '__createdAt', type: 'datetimeoffset' },
                    { name: '__updatedAt', type: 'datetimeoffset' },
                    { name: '__deleted', type: 'bit' }
                ]);
            });
    });

    it("creates table and schema", function () {
        var item = { id: '1', string: 'test', number: 1, boolean: true };
        return dynamicSchema.execute(table, statements.insert(table, item), item)
            .then(function () {
                return execute(config, statements.getColumns(table));
            })
            .then(function (columns) {
                expect(columns).to.deep.equal([
                    { name: 'id', type: 'nvarchar' },
                    { name: '__version', type: 'timestamp' },
                    { name: '__createdAt', type: 'datetimeoffset' },
                    { name: '__updatedAt', type: 'datetimeoffset' },
                    { name: '__deleted', type: 'bit' },
                    { name: 'string', type: 'nvarchar' },
                    { name: 'number', type: 'float' },
                    { name: 'boolean', type: 'bit' }
                ]);
            });
    });

    it("updates schema", function () {
        var item = { id: '1', string: 'test', number: 1, boolean: true };
        return dynamicSchema.execute(table, statements.insert(table, { id: '1' }), { id: '1' })
            .then(function () {
                return dynamicSchema.execute(table, statements.update(table, item), item);
            })
            .then(function () {
                return execute(config, statements.getColumns(table));
            })
            .then(function (columns) {
                expect(columns).to.deep.equal([
                    { name: 'id', type: 'nvarchar' },
                    { name: '__version', type: 'timestamp' },
                    { name: '__createdAt', type: 'datetimeoffset' },
                    { name: '__updatedAt', type: 'datetimeoffset' },
                    { name: '__deleted', type: 'bit' },
                    { name: 'string', type: 'nvarchar' },
                    { name: 'number', type: 'float' },
                    { name: 'boolean', type: 'bit' }
                ]);
            });
    });

    it("creates primary key constraint", function () {
        var item = { id: '1' };
        return dynamicSchema.execute(table, statements.insert(table, item), item)
            .then(function () {
                return execute(config, { sql: "SELECT * FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'dynamicSchema'" });
            })
            .then(function (constraints) {
                expect(constraints.length).to.equal(1);
                expect(constraints[0].CONSTRAINT_NAME.indexOf('PK__dynamicS')).to.not.equal(-1);
            });
    });

    it("creates table and schema with numeric id", function () {
        var item = { id: 1, string: 'test', number: 1, boolean: true };
        return dynamicSchema.execute(table, statements.insert(table, item), item)
            .then(function () {
                return execute(config, statements.getColumns(table));
            })
            .then(function (columns) {
                expect(columns).to.deep.equal([
                    { name: 'id', type: 'int' },
                    { name: '__version', type: 'timestamp' },
                    { name: '__createdAt', type: 'datetimeoffset' },
                    { name: '__updatedAt', type: 'datetimeoffset' },
                    { name: '__deleted', type: 'bit' },
                    { name: 'string', type: 'nvarchar' },
                    { name: 'number', type: 'float' },
                    { name: 'boolean', type: 'bit' }
                ]);
            });
    });

    it("creates table with autoIncrement identity if specified", function () {
        var item = { value: 'test' },
            autoIncrementTable = { name: 'dynamicSchema', autoIncrement: true };
        return dynamicSchema.execute(autoIncrementTable, statements.insert(autoIncrementTable, item), item)
            .then(function () {
                return execute(config, statements.read(queries.create('dynamicSchema')));
            })
            .then(function (results) {
                expect(results).to.containSubset([[{ id: 1, value: 'test' }]]);
            });
    });

    it("creates insert/update/delete trigger", function () {
        var item = { id: '1' };
        return dynamicSchema.execute(table, statements.insert(table, item), item)
            .then(function () {
                return execute(config, { sql: "SELECT * FROM sys.triggers WHERE name = 'TR_dynamicSchema_InsertUpdateDelete'" });
            })
            .then(function (triggers) {
                expect(triggers.length).to.equal(1);
            });
    });

    it("updates __updatedAt column", function () {
        var item = { id: '1', string: 'test', number: 1, boolean: true },
            updatedAt;

        return dynamicSchema.execute(table, statements.insert(table, item), item)
            .then(function (inserted) {
                updatedAt = inserted[0].__updatedAt;
                // I don't quite understand why the test is occasionally flaky. Suspect datetimeoffset resolution in SQL Server.
                return promises.sleep();
            })
            .then(function () {
                return dynamicSchema.execute(table, statements.update(table, item), item);
            })
            .then(function (updated) {
                expect(updated[1][0].__updatedAt).to.be.greaterThan(updatedAt);
            });
    });

    it("creates predefined columns", function () {
        var table = { name: 'dynamicSchema', columns: {
                string: 'string',
                number: 'number',
                bool: 'boolean',
                date: 'datetime'
            } },
            item = { id: '1' };

        return dynamicSchema.execute(table, statements.insert(table, item), item)
            .then(function () {
                return execute(config, statements.getColumns(table));
            })
            .then(function (columns) {
                expect(columns).to.deep.equal([
                    { name: 'id', type: 'nvarchar' },
                    { name: '__version', type: 'timestamp' },
                    { name: '__createdAt', type: 'datetimeoffset' },
                    { name: '__updatedAt', type: 'datetimeoffset' },
                    { name: '__deleted', type: 'bit' },
                    { name: 'string', type: 'nvarchar' },
                    { name: 'number', type: 'float' },
                    { name: 'bool', type: 'bit' },
                    { name: 'date', type: 'datetimeoffset' }
                ]);
            });
    });

    it("uses predefined column types over item types when duplicated with different casing", function () {
        var table = { name: 'dynamicSchema', columns: { string: 'string' } },
            item = { id: '1', String: 1 };

        return dynamicSchema.execute(table, statements.insert(table, item), item)
            .then(function () {
                return execute(config, statements.getColumns(table));
            })
            .then(function (columns) {
                expect(columns).to.deep.equal([
                    { name: 'id', type: 'nvarchar' },
                    { name: '__version', type: 'timestamp' },
                    { name: '__createdAt', type: 'datetimeoffset' },
                    { name: '__updatedAt', type: 'datetimeoffset' },
                    { name: '__deleted', type: 'bit' },
                    { name: 'string', type: 'nvarchar' }
                ]);
            });
    });

    it("creates predefined indexes", function () {
        var table = { 
            name: 'dynamicSchema',
            columns: {
                string: 'string',
                blah: 'number',
                num: 'number',
                bool: 'boolean'
            },
            indexes : [
                'blah',
                ['bool', 'num'],
                ['blah', 'bool', 'num']
            ]
        },
            item = { id: '1'};

        return dynamicSchema.execute(table, statements.insert(table, item), item)
            .then(function() {
                return execute(config, statements.getIndexes(table));
            })
            .then(function (indexesInfo) {
                expect(transformIndexInfo(indexesInfo)).to.containSubset(transformIndexConfig(table.indexes));
            });
    });

    it("throws error when creating index with unsupported column type", function () {
        var table = { 
            name: 'dynamicSchema',
            columns: {
                string: 'string'
            },
            indexes : [
                'string'
            ]
        },
            item = { id: '1'};

        return expect(dynamicSchema.execute(table, statements.insert(table, item), item))
            .to.be.rejectedWith('Column \'string\' in table \'dbo.dynamicSchema\' is of a type that is invalid for use as a key column in an index.');
    });

    it("throws error when creating index on column that does not exist", function () {
        var table = { 
            name: 'dynamicSchema',
            columns: {
                blah: 'number'
            },
            indexes : [
                'foo'
            ]
        },
            item = { id: '1'};

        return expect(dynamicSchema.execute(table, statements.insert(table, item), item))
            .to.be.rejectedWith('Column name \'foo\' does not exist in the target table or view.');
    });

    it("throws error when index columns is not an array", function () {
        var table = { 
            name: 'dynamicSchema',
            columns: {
                blah: 'number'
            },
            indexes : [
                {}
            ]
        },
            item = { id: '1'};

        return expect(dynamicSchema.execute(table, statements.insert(table, item), item))
            .to.be.rejectedWith('Index configuration in table \'' + table.name + '\' is not an array of strings / arrays of strings.');
    });

    it("throws error when indexes config is not an array", function () {
        var table = { 
            name: 'dynamicSchema',
            columns: {
                blah: 'number'
            },
            indexes : {}
        },
            item = { id: '1'};

        return expect(dynamicSchema.execute(table, statements.insert(table, item), item))
            .to.be.rejectedWith('Index configuration in table \'' + table.name + '\' is not an array of strings / arrays of strings.');
    });
});

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
