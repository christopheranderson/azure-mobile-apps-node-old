var app = require('express')(),
    mobileApp = require('azure-mobile-apps')({
        data: {
            user: 'dale',
            password: 'Blah1234',
            server: 'localhost',
            database: 'todo'
        }
    });

mobileApp.tables.add('todoitem');
mobileApp.attach(app);

app.listen(3000);
