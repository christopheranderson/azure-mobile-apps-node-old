var table = require('azure-mobile-apps').table(),
    hub = require('azure-sb').createNotificationHubService('hubName', 'connectionString', 'keyName', 'keyValue')

table.read(function (query, context) {
    return context.execute().then(function () {
        hub.wns.sendToastText01(
            null,
            { text1: 'New item added by ' + context.user.name },
            function (error) {
                if (error) {
                    // log error, notify client
                }
            });
    })
})
