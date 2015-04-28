module.exports = function (req, res, next) {
    // this is obviously not sufficient!
    if (req.path.indexOf('/tables/') > -1) {

    } else
        next();
}