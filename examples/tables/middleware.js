var todo = require('zumo.tables')('todo');

// set middleware to apply to all operations
todo.use(authorise, todo.execute);

// apply pre and post operation middleware
todo.read(todo.executeRead, log);
todo.insert(authorise, todo.executeInsert, sendPushNotification);
todo.update(authorise, todo.executeUpdate);
//todo.delete(authorise, todo.executeInsert, log); // default behavior

module.exports = todo;