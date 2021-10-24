import 'babel-polyfill';

if (typeof Promise !== 'function' && typeof Promise !== 'object') {
    throw "Cannot polyfill Promise when it is " + JSON.stringify(Promise);
}

var rejectByThrowing = function (err) {
    setTimeout(function () { throw err }, 0);
};

if (typeof Promise.prototype.done !== 'function') {

    Promise.prototype.done = function () {
        return this.then.apply(this, arguments);
    };
}

if (typeof Promise.prototype.fail !== 'function') {

    Promise.prototype.fail = function () {
        return this.then.apply(this, [null, arguments[0]]);
    };
}

if (typeof Promise.prototype.always !== 'function') {

    Promise.prototype.always = function () {
        return this.then.apply(this, [null, null, arguments[0]]);
    };
}
