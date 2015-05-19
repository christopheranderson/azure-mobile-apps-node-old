// generally, for success cases, we are where the buck stops - no further middleware will be executed unless we explicitly call next
// for error cases, we want to allow the error to flow through to other error handling middleware
module.exports = {
    get: function (req, res, next) {
        return { message: 'Hello world!' };                         // will be stringified and rendered, request ends
    },
    post: function (req, res, next) {
        return new Promise(function (resolve, reject) {
            resolve({ message: 'Hello world!' });                   // returned promises will render the result and end the request on resolution
            resolve(fs.createReadStream('path/to/file'));           // returning a stream will cause the stream to be piped to the response
            reject(new Error('Something went wrong'));              // rejected promises will be allowed to flow on to the global error handler
        });
    },
    patch: function (req, res, next) {
        setTimeout(function () {                                    // this is an async function
            try {
                throw new Error('something went wrong');
            } catch (e) {
                next(e);                                            // the next function allows errors to be passed to error handling middleware down the line
            }
        });
    },
    delete: function (req, res, next) {
        throw new Error('something went wrong');                    // synchronous errors will automatically be caught by zumo and passed on to error handling middleware
    },
    put: function (req, res, next) {
        next();                                                     // in some scenarios, we want to pass control on to further middleware by calling next explicitly
    }
};