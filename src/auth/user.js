var getIdentity = require('./getIdentity');

module.exports = function (authConfiguration, token, claims) {
    return {
        id: claims.uid,
        token: token,
        claims: claims,
        getIdentity: getIdentity
    };

    function getIdentity(provider) {
        // if we've been passed a custom getIdentity function, use it. Mainly to support testing without hitting a gateway.
        if(authConfiguration.getIdentity)
            return authConfiguration.getIdentity(authConfiguration, token, provider);
        return getIdentity(authConfiguration, token, provider);
    }
}
