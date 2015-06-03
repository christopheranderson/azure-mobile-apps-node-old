var table = require('azure-mobile-apps').table()

table.read.use(table.operation, setDateLoaded)

table.read(function (query, context) {
    return context.execute(query.where({ category: 'furniture' }))
})

function setDateLoaded(req, res, next) {
    res.results.forEach(function (item) {
        item.dateLoaded = Date.now()
    })
    next()
}
