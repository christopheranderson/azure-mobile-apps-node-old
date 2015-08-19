var user = require('./user'),
    jwt = require('jsonwebtoken'),
    crypto = require('crypto'),
    promises = require('../utilities/promises');

module.exports = function (config) {
    var key = hashSecret(config.secret);

    return {
        validate: function (token) {
            return promises.create(function (resolve, reject) {
                var options = {
                    audience: config.audience || 'urn:microsoft:windows-azure:zumo',
                    issuer: config.issuer || 'urn:microsoft:windows-azure:zumo'
                };

                jwt.verify(token, key, options, function (err, claims) {
                    if(err)
                        reject(err);
                    else
                        resolve(user(config, token, claims));
                });
            });
        },
        sign: function (payload) {
            var options = {
                audience: config.audience || 'urn:microsoft:windows-azure:zumo',
                issuer: config.issuer || 'urn:microsoft:windows-azure:zumo',
                expiresInMinutes: config.expires || 1440
            };
            return jwt.sign(payload, key, options);
        }
    };
};

function hashSecret(secret) {
    var hasher = crypto.createHash('sha256');
    hasher.update(secret, 'utf8');
    return hasher.digest();
}
