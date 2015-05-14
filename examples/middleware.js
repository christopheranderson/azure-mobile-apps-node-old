var express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),

    app = express();

app.use(morgan('dev'));

app.use(function (req, res, next) {
    if (req.query.stop)
        res.end('You passed a querystring');
    else
        next();
});

app.use(bodyParser.json());

app.get('/test', function (req, res, next) {
    res.end('You hit the test endpoint!');
});

app.get('/test2', function (req, res, next) {
    res.end('You hit the test2 endpoint!');
});

app.use(function (req, res) {
    res.status(404).end('Not found');
});

app.listen(3000);