define(['exports', 'jquery', 'can.full', 'stache!pages/movielist.stache'], function (exports, _jquery, _can, _movielist) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _jquery2 = _interopRequireDefault(_jquery);

    var _can2 = _interopRequireDefault(_can);

    var _movielist2 = _interopRequireDefault(_movielist);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    if (!window._proxy) {
        window._proxy = {
            getInterceptor: function getInterceptor(object, propertyName) {
                if (object.attr && (object._data && object._data[propertyName] || object._computedAttrs && object._computedAttrs[propertyName] && object._computedAttrs[propertyName].compute)) {
                    return object.attr(propertyName);
                }return object[propertyName];
            }, setInterceptor: function setInterceptor(object, propertyName, value) {
                if (object.attr) {
                    return object.attr(propertyName, value);
                } else {
                    return object[propertyName] = value;
                }
            }, updatePostfixAddInterceptor: function updatePostfixAddInterceptor(object, propertyName) {
                var original = this.getInterceptor(object, propertyName);this.setInterceptor(object, propertyName, original + 1);return original;
            }, updatePostfixSubtractInterceptor: function updatePostfixSubtractInterceptor(object, propertyName, value) {
                var original = this.getInterceptor(object, propertyName);this.setInterceptor(object, propertyName, value - 1);return original;
            } };
    }exports.default = _proxy.getInterceptor(_can2.default, 'Component').extend({
        tag: "movielist",
        template: _movielist2.default,
        viewModel: _proxy.getInterceptor(_can2.default, 'Map').extend({
            define: {
                title: {
                    get: function get() {
                        return "View movies";
                    }
                },
                location: {
                    Value: _proxy.getInterceptor(_can2.default, 'Map')
                }
            }
        })
    });
});
