module.exports = {
    values: function (source) {
        return Object.keys(source).map(function (property) {
            return source[property];
        });
    }
}
