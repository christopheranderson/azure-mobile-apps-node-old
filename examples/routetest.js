var connectRoute = require('connect-route'),
    connect = require('connect'),
    app = connect();

app.use(connectRoute(function (router) {
    router.get('/*/:id', function (req, res, next) {
        res.write(JSON.stringify(req.params));
        res.end(JSON.stringify(req.query));
    });
}));

app.use(function (req, res, next) {
    res.end('fallback');
});

app.listen(3000);