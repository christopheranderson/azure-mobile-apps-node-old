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

app.get('/error', function (req, res, next) {
    throw new Error("Something went wrong");
});

app.get('/error2', function (req, res, next) {
    next(new Error("Something went wrong"));
});

app.use(function (err, req, res, next) {
    res.status(500).json({
        message: err.message,
        stack: err.stack
    })
});

app.use(function (req, res) {
    res.status(404).end('Not found');
});

app.listen(3000);