var winston = require('winston');

module.exports = {
    log: winston.log,
    info: winston.info,
    error: winston.error,
    debug: logAtLevel('debug'),
    verbose: logAtLevel('verbose'),
    warn: logAtLevel('warn'),
    initialise: initialise,
    setLevel: setLevel
}

function initialise(config) {
    config = config || {};
    setLevel(config.level);
}

function setLevel(level) {
    if(level)
        winston.level = level;
}

function logAtLevel(level) {
    return function () {
        winston.log.apply(winston, Array.prototype.concat.apply([level], arguments));
    };
}
