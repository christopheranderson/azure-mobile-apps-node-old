var tables = require('zumo.tables'),
    todo = tables('todo');

todo.read = function (query, context) {
    query.filter.splice(0, 1);
    return context.execute();
};

todo.insert = function (item, context) {
    authorise(context);
    return context.execute.then(function () {
        sendPushNotification();
    });
};

todo.update = function (item, context) {
    authorise(context);
    return context.execute();
};

//todo.delete = function (id, context) {
//};
