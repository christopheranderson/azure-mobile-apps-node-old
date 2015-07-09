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
mobileApp.tables.add('blog_comments');
mobileApp.tables.add('blog_posts');
mobileApp.tables.add('dates');
mobileApp.tables.add('movies');
mobileApp.tables.add('ParamsTestTable');
mobileApp.tables.add('IntIdRoundTripTable', { autoIncrement: true });
mobileApp.tables.add('intIdMovies', { autoIncrement: true });

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
mobileApp.tables.add('roundTripTable', table);

mobileApp.attach(app);
app.listen(process.env.PORT || 3000);
