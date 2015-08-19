var winston = require('winston'),
    logger = new (winston.Logger)();

logger.initialise = function (config) {
    config = config || {};

    clearTransports();
    addTransports(config);
}

module.exports = logger;

function clearTransports() {
    Object.keys(logger.transports).forEach(function (transport) {
        logger.remove(transport);
    });
}

function addTransports(config) {
    if(config.transports) {
        Object.keys(config.transports).forEach(function (key) {
            logger.add(winston.transports[key], config.transports[key]);
            if(config.transports[key].level === undefined) {
                logger.transports[winston.transports[key].name].level = config.level;
            }
        });
    }
}