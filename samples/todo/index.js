var app = require('express')(),
    mobileApp = require('azure-mobile-apps')({
        data: {
            provider: 'sql',
            user: 'dalander',
            password: 'Blah1234',
            server: 'dalanderv2.database.windows.net',
            database: 'todo'
        }
        // data: {
        //     provider: 'sql',
        //     user: 'dale',
        //     password: 'Blah1234',
        //     server: 'localhost',
        //     database: 'todo'
        // }
    });

mobileApp.tables.add('todoitem');
mobileApp.attach(app);

app.listen(process.env.PORT || 3000);
