var middleware = require('../../../src/express/middleware/authenticate'),
    expect = require('chai').use(require('chai-subset')).expect,
    secret = 'secret', // token and secret E2E tests
    token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2ZXIiOiIzIiwidWlkIjoiRmFjZWJvb2s6c29tZXVzZXJpZEBob3RtYWlsLmNvbSIsImlzcyI6InVybjptaWNyb3NvZnQ6d2luZG93cy1henVyZTp6dW1vIiwiYXVkIjoidXJuOm1pY3Jvc29mdDp3aW5kb3dzLWF6dXJlOnp1bW8iLCJleHAiOjE0NDAwMDk0MjQsIm5iZiI6MTQzNzQxNzQyNH0.9EvyzV53b2SkBCc46GR4N77NU-3SJEuYzQl8lmlp7QY',
    config = { auth: { secret: secret } };

describe('azure-mobile-apps.express.middleware.authenticate', function () {
    it("populates context.user with validated claims", function (done) {
        var req = { get: function () { return token; } };
        middleware(config)(req, null, function () {
            try {
                expect(req.azureMobile.user).to.containSubset({
                    claims: {
                        "aud": "urn:microsoft:windows-azure:zumo",
                        "exp": 1440009424,
                        "iss": "urn:microsoft:windows-azure:zumo",
                        "nbf": 1437417424,
                        "uid": "Facebook:someuserid@hotmail.com",
                        "ver": "3"
                    },
                    token: token,
                    id: "Facebook:someuserid@hotmail.com"
                });
                done();
            } catch(err) {
                done(err);
            }
        });
    });
});
