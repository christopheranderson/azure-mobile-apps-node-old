var app = require('express')(),
    zumo = require('zumo')();

zumo.tables.add('./configuration/tables/');
zumo.api.add('./configuration/api/');
zumo.attach(app);

app.listen(1337);
