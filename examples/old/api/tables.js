module.exports = {
    authenticate: true,
    post: function (req, res, next) {
        return req.zumo.tables('table1')
            .query()
            .where({ id: 'someId' })
            .then(function (results) {
                if(results.length === 0)
                    return req.zumo.tables('table2').create({ id: 'new', value: 37 });
            });
    }
}
