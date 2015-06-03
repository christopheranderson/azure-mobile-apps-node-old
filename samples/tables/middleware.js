var table = require('azure-mobile-apps').table()

table.read.use(modifyQuery, table.operation, setDateLoaded)
table.insert.use(setUserId, table.operation)

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
