module.exports = {
    insert: function (item, user, context) {
        context.zumo.push.wns.sendTileSquarePeekImageAndText01(
            null,
            {
                image1src: 'http://foobar.com/dog.jpg',
                image1alt: 'A dog',
                text1: 'This is a dog',
                text2: 'The dog is nice',
                text3: 'The dog bites',
                text4: 'Beware of dog'
            },
            function (error) {
                if (error) {
                    // log error, notify client
                } else {
                    // message sent successfully, execute insert operation
                    // we could do this independently of the push notification
                    context.execute();
                }
            });
    }
}
