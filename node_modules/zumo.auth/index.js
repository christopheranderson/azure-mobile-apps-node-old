module.exports = function (configuration) {
    return function (req, res, next) {
        if (!req.headers['x-zumo-auth'])
            res.status(401).end('Not authorised');

        // validate token and attach to req
        req.user = JSON.parse(req.headers['x-zumo-auth']);
    };
};