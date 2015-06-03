var table = require('azure-mobile-apps').table()

table.read(function (query, context) {
    // modify the query to only return items where the category is 'furniture'
    return context.execute(query.where({ category: 'furniture' }))
        .then(function (results) {
            results.forEach(function (item) {
                // set the date loaded on each result
                item.dateLoaded = Date.now()
            })
        })
})

table.insert(function (item, context) {
    // set the userId on the item before saving to the database
    item.userId = context.user.id
    return context.execute()
})
