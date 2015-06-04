var table = require('azure-mobile-apps').table(),
    http = require('q-http')

table.insert(function (item, context) {
    return http.request({
        url: 'https://webservice.com/service/',
        body: { keyword: item.keyword }
    }).then(function (result) {
        item.relatedArticles = result.articles
    }).then(context.execute)
})
