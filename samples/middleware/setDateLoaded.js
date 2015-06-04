module.exports = function (req, res, next) {
    res.results.forEach(function (item) {
        item.dateLoaded = Date.now()
    })
    next()
}
