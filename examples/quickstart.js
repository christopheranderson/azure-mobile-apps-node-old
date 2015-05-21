var app = require('express')(),
    zumo = require('zumo')();

zumo.tables.add('todoitem');
zumo.attach(app);
app.listen(process.env.PORT);
    