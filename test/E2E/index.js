var app = require('express')(),
    mobileApp = require('azure-mobile-apps')({
        data: {
            provider: 'sql',
            user: 'azure-mobile-apps-test',
            password: 'Blah1234',
            server: 'localhost',
            database: 'e2e'
        }
    });

mobileApp.tables.add('authenticated');
mobileApp.tables.add('blog_comments', { columns: { postId: 'string', commentText: 'string', name: 'string', test: 'number' } });
mobileApp.tables.add('blog_posts', { columns: { title: 'string', commentCount: 'number', showComments: 'boolean', data: 'string' } });
mobileApp.tables.add('dates', { columns: { date: 'date', dateOffset: 'date' } });
mobileApp.tables.add('movies', { columns: { title: 'string', duration: 'number', mpaaRating: 'string', releaseDate: 'date', bestPictureWinner: 'boolean' } });
mobileApp.tables.add('ParamsTestTable');
mobileApp.tables.add('IntIdRoundTripTable', { autoIncrement: true, columns: { name: 'string', date1: 'date', bool: 'boolean', integer: 'number', number: 'number' } });
mobileApp.tables.add('intIdMovies', { autoIncrement: true, columns: { title: 'string', duration: 'number', mpaaRating: 'string', releaseDate: 'date', bestPictureWinner: 'boolean' } });

var table = mobileApp.table();
table.update(function (context) {
    return context.execute()
        .catch(function (error) {
            if(context.req.query.conflictPolicy === 'clientWins') {
                context.item.__version = error.item.__version;
                return context.execute();
            } else if (context.req.query.conflictPolicy === 'serverWins') {
                return error.item;
            } else {
                throw error;
            }
        });
});
table.columns = { name: 'string', date1: 'date', bool: 'boolean', integer: 'number', number: 'number' };
mobileApp.tables.add('roundTripTable', table);

mobileApp.attach(app);
app.listen(process.env.PORT || 3000);
