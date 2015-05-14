var Transform = require('stream').Transform;

util.inherits(LogStream, Transform);

function LogStream(options) {
    Transform.call(this, options);
}

LogStream.prototype._transform = function (message) {
    this.push(new Date().toString() + ' - ' + message);
};

LogStream.prototype.debug = function (message) {

};

LogStream.prototype.info = function (message) {

};

LogStream.prototype.warn = function (message) {

};

LogStream.prototype.error = function (message) {

};