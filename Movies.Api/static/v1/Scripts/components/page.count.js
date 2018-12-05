define(['exports', 'can.full', 'jquery', 'bootpag'], function (exports, _can, _jquery, _bootpag) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _can2 = _interopRequireDefault(_can);

    var _jquery2 = _interopRequireDefault(_jquery);

    var _bootpag2 = _interopRequireDefault(_bootpag);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    if (!window._proxy) {
        window._proxy = {
            getInterceptor: function getInterceptor(object, propertyName) {
                if (object.attr && (object._data && object._data[propertyName] !== undefined || object._computedAttrs && object._computedAttrs[propertyName])) {
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
            },
            updatePostfixSubtractInterceptor: function updatePostfixSubtractInterceptor(object, propertyName, value) {
                var original = this.getInterceptor(object, propertyName);this.setInterceptor(object, propertyName, value - 1);return original;
            } };
    }exports.default = _proxy.getInterceptor(_can2.default, 'Component').extend({
        tag: "page-count",
        viewModel: _proxy.getInterceptor(_can2.default, 'Map').extend({
            define: {
                currentPage: {
                    type: 'number',
                    set: function set(value) {
                        if (value === undefined || value === null || value < 1) {
                            return 1;
                        } else {
                            return value;
                        }
                    }
                },
                pageCount: {
                    type: 'number',
                    set: function set(value) {
                        if (value === undefined || value === null || value < 1) {
                            return 1;
                        } else {
                            return value;
                        }
                    } },
                maxpages: {
                    type: 'number',
                    set: function set(value) {
                        if (value === undefined || value === null || value < 1) {
                            return 1;
                        } else {
                            return value;
                        }
                    }
                }
            }
        }),
        events: {
            inserted: 'syncPager',
            '{currentPage} change': 'syncPager',
            '{pageCount} change': 'syncPager',
            '{maxpages} change': 'syncPager',
            '{viewModel} currentPage set': 'syncPager',
            '{viewModel} pageCount set': 'syncPager',
            '{viewModel} maxpages set': 'syncPager',
            syncPager: function syncPager() {
                var options = {
                    total: _proxy.getInterceptor(_proxy.getInterceptor(this, 'viewModel'), 'pageCount'),
                    page: _proxy.getInterceptor(_proxy.getInterceptor(this, 'viewModel'), 'currentPage'),
                    maxVisible: _proxy.getInterceptor(_proxy.getInterceptor(this, 'viewModel'), 'maxpages')
                };
                (0, _jquery2.default)(_proxy.getInterceptor(this, 'element')).bootpag(options);
            },
            '{element} page': function elementPage(_el, _ev, data) {
                _proxy.setInterceptor(_proxy.getInterceptor(this, 'viewModel'), 'currentPage', data);
            }
        }
    });
});
//# sourceMappingURL=page.count.js.map
