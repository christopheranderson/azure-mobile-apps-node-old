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
mobileApp.tables.add('roundTripTable');
mobileApp.tables.add('IntIdRoundTripTable', { autoIncrement: true });
mobileApp.tables.add('intIdMovies', { autoIncrement: true });
mobileApp.attach(app);

app.listen(process.env.PORT || 3000);
