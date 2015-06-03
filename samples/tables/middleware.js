var table = require('azure-mobile-apps').table()

table.use.read(modifyQuery, table.operation, setDateLoaded)
table.use.insert(setUserId, table.operation)

function modifyQuery(req, res, next) {
    req.query = req.query.where({ category: 'furniture' })
    next()
}

function setDateLoaded(req, res, next) {
    res.results.forEach(function (item) {
        item.dateLoaded = Date.now()
    })
    next()
}

function setUserId(req, res, next) {
    req.item.userId = req.user.id
    next()
}
