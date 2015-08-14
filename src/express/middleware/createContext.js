var data = require('../../data');

module.exports = function (configuration) {
    var provider = data(configuration);

    return function (req, res, next) {
        req.azureMobile = {
            req: req,
            res: res,
            data: provider,
            tables: function (name) {
                return provider(configuration.tables[name]);
            }
        };
        next();
    };
};
