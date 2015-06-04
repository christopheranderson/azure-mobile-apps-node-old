var table = require('azure-mobile-apps').table(),
    setDateLoaded = require('../middleware/setDateLoaded')

table.read.use(table.operation, setDateLoaded)

table.read(function (query, context) {
    return context.execute(query.where({ category: 'furniture' }))
})
