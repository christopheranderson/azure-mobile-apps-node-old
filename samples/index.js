var app = require('express')(),
    mobileApp = require('azure-mobile-apps')();

// use tables configured in the tables directory
mobileApp.attach(app);
app.listen(process.env.PORT);
