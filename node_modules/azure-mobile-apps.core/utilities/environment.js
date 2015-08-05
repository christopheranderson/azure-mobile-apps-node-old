module.exports = {
    debug: process.execArgv.some(function (arg) {
        return arg.indexOf('--debug') === 0;
    })
    // hosted: function () {
    //
    // }
};
