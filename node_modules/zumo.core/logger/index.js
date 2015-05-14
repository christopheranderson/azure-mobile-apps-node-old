var LogStream = require('./LogStream'),
    user = new LogStream(),
    system = new LogStream();

user.system = system;

user.initialise = function (userStream, systemStream) {
    user.pipe(userStream || process.stdout);
    system.pipe(systemStream || process.stdout);
};

module.exports = user;