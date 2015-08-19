var auth = require('../../auth')

module.exports = function (configuration) {
    return function (req, res, next) {
        if(configuration && configuration.auth) {
            var token = req.get('x-zumo-auth');

            if(token) {
                var authUtils = auth(configuration.auth);

                req.azureMobile = req.azureMobile || {};
                req.azureMobile.auth = authUtils;

                authUtils.validate(token)
                    .then(function (claims) {
                        req.azureMobile = req.azureMobile || {};
                        req.azureMobile.user = claims;
                        next();
                    })
                    .catch(function (error) {
                        res.status(401).send(error);
                    });
            } else {
                next();
            }
        } else {
            next();
        }
    };
};
