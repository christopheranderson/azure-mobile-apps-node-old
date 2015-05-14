module.exports = function (configuration) {
    var api = require('./api')(configuration),
        auth = require('./auth')(configuration),
        push = require('./push')(configuration),
        tables = require('./tables')(configuration);

    return {
        attach: function (app) {
            app.use(api);
            app.use(auth);
            app.use(push);
            app.use(tables);
        },
        api: api,
        auth: auth,
        push: push,
        tables: tables
    };
}