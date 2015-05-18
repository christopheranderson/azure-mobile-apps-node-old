module.exports = {
    authenticate: true,
    get: function (req, res, next) {
        // the auth middleware must have been executed for the user property to be set
        if(req.user.level === 'anonymous')
            res.status(401).send("We don't know you. Who are you?");
        else
            // the user object contains the user ID and payload
            res.send("Hello " + req.user.id + "! Your payload is " + JSON.stringify(req.user.payload));
    }
}
