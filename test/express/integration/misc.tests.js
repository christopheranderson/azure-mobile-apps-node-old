var expect = require('chai').expect,
    supertest = require('supertest-as-promised'),
    express = require('express'),
    mobileApps = require('../../../src/express'),
    app, mobileApp;

describe('azure-mobile-apps.express.integration', function () {
    describe('errors', function () {
        it('returns error details when in debug mode', function () {
            setup(true);
            return supertest(app)
                .get('/tables/todoitem')
                .expect(500)
                .then(function (res) {
                    expect(res.body.message).to.equal('test');
                    expect(res.body.stack).to.not.be.undefined;
                });
        });

        it('does not return error details when not in debug mode', function () {
            setup(false);
            return supertest(app)
                .get('/tables/todoitem')
                .expect(500)
                .then(function (res) {
                    expect(res.body).to.be.empty;
                });
        });
    });

    describe('version', function () {
        it('attaches version header', function () {
            setup(false, 'version');
            return supertest(app)
                .get('/tables/todoitem')
                .expect('x-zumo-version', 'version')
                .expect(500);
        });
    });

    function setup(debug, version) {
        app = express();
        mobileApp = mobileApps({ debug: debug, version: version });
        var table = mobileApp.table();
        table.read.use(function (req, res, next) { throw new Error('test'); });
        mobileApp.tables.add('todoitem', table);
        mobileApp.attach(app);
    }
});
