define(['exports', 'can.full', 'jquery', 'stache!app.stache'], function (exports, _can, _jquery, _stacheApp) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _can2 = _interopRequireDefault(_can);

    var _jquery2 = _interopRequireDefault(_jquery);

    var _stacheApp2 = _interopRequireDefault(_stacheApp);

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
    }

    var appCtor = _proxy.getInterceptor(_can2.default, 'Control').extend({}, {
        setup: function setup(element, options) {
            options = options || {};
            _can2.default.route('/v1/movies/:page', { page: 'movielist' });
            _can2.default.route('/v1/movies/:page/:slug', { slug: null });
            _proxy.setInterceptor(options, 'appState', new (_proxy.getInterceptor(_can2.default, 'Map'))({ location: {}, title: '' }));
            _proxy.getInterceptor(_can2.default, 'route').map(_proxy.getInterceptor(_proxy.getInterceptor(options, 'appState'), 'location'));
            return this._super(element, options);
        },
        init: function init(element, _options) {
            //init routing
            _proxy.getInterceptor(_can2.default, 'route').ready();
            //init templating
            element.html((0, _stacheApp2.default)(_proxy.getInterceptor(_proxy.getInterceptor(this, 'options'), 'appState')));
        },
        'a[href="#"] click': function aHrefClick(_el, ev) {
            ev.preventDefault();
        },
        'form submit': function formSubmit(_el, ev) {
            ev.preventDefault();
        },
        // the route has changed
        "{appState} location change": function appStateLocationChange() {
            (0, _jquery2.default)('body, html').scrollTop(0);
        }
    });

    exports.default = appCtor;
});
