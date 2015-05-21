var app = require('express')(),
    zumo = require('zumo')();

// table configuration is imported from /tables by default
zumo.attach(app);

app.listen(1337);
