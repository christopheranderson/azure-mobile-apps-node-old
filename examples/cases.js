// Applying simple logic to reject requests that do not follow business rules
table.insert = function (item, user, context) {
    if (item.userid !== user.userId) {
        context.response.status(statusCodes.BAD_REQUEST).send('You may only insert records with your userId.');
    } else {
        context.execute();
    }
}

// Modify a record on the server before it is saved
table.update = function (item, user, context) {
    item.updatedAt = new Date();
    context.execute();
}

// Modify a record after it has been read from the database but before it is sent to the client
table.read = function (query, user, context) {
    return context.execute().then(function (results) {
        var now = new Date();
        results.forEach(function (item) { item.retrievedAt = now; });
    });
}

// Modify the incoming query to only return records for the current user
table.read = function (query, user, context) {
    query.where({ userid: user.userId });
    context.execute();
}

// Execute a seperate query to read a permissions table to determine whether the original operation should be permitted
table.insert = function (item, user, context) {
    var permissionsQuery = new Query('permissions')
        .where({ userId: user.userId, permission: 'submit order' });
    
    return context.tables.read(permissionsQuery).then(function (results) {
        if (results.length > 0) {
            // Permission record was found. Continue normal execution.
            return context.execute();
        } else {
            log.info('User %s attempted to submit an order without permissions.', user.userId);
            context.response.status(statusCodes.FORBIDDEN).send('You do not have permission to submit orders.');
        }
    });
}

// Same as above using SQL
table.insert = function (item, user, context) {
    var sql = "SELECT _id FROM permissions WHERE userId = ? AND permission = 'submit order'";
    return context.sql.query(sql, [user.userId]).then(function (results) {
        if (results.length > 0) {
            // Permission record was found. Continue normal execution.
            return context.execute();
        } else {
            log.info('User %s attempted to submit an order without permissions.', user.userId);
            context.response.status(statusCodes.FORBIDDEN).send('You do not have permission to submit orders.');
        }
    });
}

// Simple push notification - send a notification when a user comments on a post
table.insert = function (comment, user, context) {
    context.execute().then(function () {
        var sql = "SELECT deviceId FROM devices " +
            "INNER JOIN posts ON devices.userId = posts.userId " +
            "WHERE posts._id = ?";
        context.sql.query(sql, [comment.postId]).then(function (results) {
            if (results.length > 0) {
                push.wns.sendToastText04(results[0].deviceId, {
                    text1: comment.username + ' commented on your post!'
                });
            }
        });
    });
}



// From Where The Friend - get checkins for my friends by modifying original query (to preserve client side filters)
table.read = function (query, user, context) {
    // First query the friends table to find the friends of the current user
    var friendsQuery = new Query('friends')
        .where({ userId: user.userId })
        .select('friendId');
    
    return context.tables.read(friendsQuery).then(function (results) {
        // Now modify the original query to only return records for the current users's friends
        query.where(function (friends) {
            return this.userId in friends;
        }, results);
        return context.execute();
    });
}

// From Where The Friend - send push notifications on checkin
table.insert = function (item, user, context) {
    return context.execute().then(function () {
        var sql =
        "select customers.deviceId from customers " +
        "inner join friends on customers.userId = friends.friendId " +
        "where friends.userId = ?";
        context.sql.query(sql, [user.userId]).then(function (results) {
            results.forEach(function (i) {
                var channel = i.deviceId;
                if (channel) {
                    push.wns.sendToastText04(channel, {
                        text1: item.username,
                        text2: item.message,
                        text3: 'Hope this works!'
                    });
                }
            });
        });
    });
}

// Bulk delete via SQL - delete the user then delete their checkins
table.delete = function (id, user, context) {
    return context.execute().then(function () {
        // The user is being deleted so delete all their checkins
        return context.sql.query("delete from checkins where userid = ?", [id]);
    });
}

// Tombstoning - mark records as deleted instead of deleting them
table.delete = function (id, user, context) {
    var sql = "update checkins set deleted = 1 where _id = ?; select @@rowcount as rowsaffected";
    context.sql.query(sql, id).then(function (results) {
        // Ignore the empty result set for the first statement.
        if (results.length > 0) {
            if (results[0].rowsaffected === 1) {
                context.response.status(statusCodes.NO_CONTENT);
            } else {
                context.response.status(statusCodes.NOT_FOUND);
            }
        }
    });
}

// Do a http request - for example, verify the inserted user's twitter screen name is valid by calling the twitter API.
table.insert = function (item, user, context) {
    if (!item.twitterScreenName) {
        context.response.status(statusCodes.BAD_REQUEST).send('You must include a twitter screen name.');
    } else {
        var request = require('request'),
            uri = 'http://api.twitter.com/1/users/show.json?screen_name=' + item.twitterScreenName;

        request(uri, function (err, response, body) {
            if (err) {
                context.response.status(statusCodes.SERVER_ERROR).send('Unable to connect to twitter.');
            } else if (response.statusCode !== 200) {
                context.response.status(statusCodes.BAD_REQUEST).send('No twitter user found with name ' + item.twitterScreenName + '.');
            } else {
                context.execute();
            }
        });
    }
}

// Display the event stream for the specified user (using SQL)
// Note: This script has an issue in that it ignores all query parameters such as top, skip, select, where, etc.
table.read = function (query, user, context) {
    if (context.parameters.streamForUserId) {
        var statusUpdatesQuery =
            "select users.name, status_updates.message from status_updates " +
            "inner join friends on status_updates.userid = friends.friendid " +
            "inner join users on status_updates.userid = users._id " +
            "where friends.userid = ?";
        
        context.sql.query(statusUpdatesQuery, context.parameters.streamForUserId).then(function (results) {
            context.response.send(results);
        });
    } else {
        context.execute();
    }
}
