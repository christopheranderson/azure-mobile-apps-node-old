module.exports = function (target, source) {
    var from;
    var keys;
    var to = toObject(target);
    
    for (var s = 1; s < arguments.length; s++) {
        from = arguments[s];
        keys = Object.keys(Object(from));
        
        for (var i = 0; i < keys.length; i++) {
            to[keys[i]] = from[keys[i]];
        }
    }
    
    return to;
};

function toObject(val) {
    if (val === null || val === undefined) {
        throw new TypeError('Object.assign cannot be called with null or undefined');
    }
    
    return Object(val);
}