var app = require('express')(),
    mobileApp = require('azure-mobile-apps')({
        data: {
            user: 'dalander',
            password: 'Blah1234',
            server: 'dalanderv2.database.windows.net',
            database: 'todo'
        }
    });

mobileApp.tables.add('todoitem');
mobileApp.attach(app);

app.listen(3000);
