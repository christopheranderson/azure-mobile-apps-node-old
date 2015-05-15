// for success cases, we are where the buck stops - no further middleware will be executed
// for error cases, we want to allow the error to flow through to other error handling middleware
module.exports = {
    get: function (req, res, context) {
        return { message: 'Hello world!' };                         // will be stringified and rendered, request ends
    },
    post: function (req, res, context) {
        return new Promise(function (resolve, reject) {
            resolve({ message: 'Hello world!' });                   // returned promises will render the result and end the request on resolution
            reject(new Error('Something went wrong'));              // rejected promises will be allowed to flow on to the global error handler
        });
    },
    patch: function (req, res, context) {
        try {
            throw new Error('something went wrong');
        } catch (e) {
            context.error = e;                                      // setting context.error will cause the error to flow through to error handling middleware


        }
    }
};