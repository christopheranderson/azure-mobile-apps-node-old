var table = require('azure-mobile-apps').table()

table.use.read(table.operation, setDateLoaded)

table.read(function (query, context) {
    return context.execute(query.where({ category: 'furniture' }))
})

function setDateLoaded(req, res, next) {
    res.results.forEach(function (item) {
        item.dateLoaded = Date.now()
    })
    next()
}
