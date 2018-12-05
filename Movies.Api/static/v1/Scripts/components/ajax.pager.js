define(['exports', 'can.full', 'jquery', 'underscore', 'services/http'], function (exports, _can, _jquery, _underscore, _http) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _can2 = _interopRequireDefault(_can);

    var _jquery2 = _interopRequireDefault(_jquery);

    var _underscore2 = _interopRequireDefault(_underscore);

    var _http2 = _interopRequireDefault(_http);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    if (!window._proxy) {
        window._proxy = { getInterceptor: function getInterceptor(object, propertyName) {
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
            }, updatePostfixSubtractInterceptor: function updatePostfixSubtractInterceptor(object, propertyName, value) {
                var original = this.getInterceptor(object, propertyName);this.setInterceptor(object, propertyName, value - 1);return original;
            } };
    }exports.default = _proxy.getInterceptor(_can2.default, 'Component').extend({
        tag: "ajax-pager",
        template: "<content/>",
        viewModel: _proxy.getInterceptor(_can2.default, 'Map').extend({
            prev: function prev() {
                if (_proxy.getInterceptor(this, 'canPrev') === true) {
                    _proxy.setInterceptor(this, 'offset', _proxy.getInterceptor(this, 'offset') - limit);
                }
            },
            next: function next() {
                if (_proxy.getInterceptor(this, 'canNext') === true) {
                    _proxy.setInterceptor(this, 'offset', _proxy.getInterceptor(this, 'offset') + _proxy.getInterceptor(this, 'limit'));
                }
            },
            changePage: function changePage(pageNumber) {
                _proxy.setInterceptor(this, 'currentPage', pageNumber);
                return false;
            },
            isToggled: function isToggled(value) {
                var checked = _proxy.getInterceptor(this, 'selectedRows').indexOf(value);
                //set checked based on if current checkbox's value is in selectedIds.
                return checked > -1;
            },
            toggle: function toggle(value, _toggle) {
                if (_toggle !== undefined && _toggle !== null) {
                    if (_toggle === true) {
                        var checked = _proxy.getInterceptor(this, 'selectedRows').indexOf(value);
                        if (checked === -1) {
                            //add id to selectedIds.
                            _proxy.getInterceptor(this, 'selectedRows').push(value);
                        }
                    } else {
                        var _checked = _proxy.getInterceptor(this, 'selectedRows').indexOf(value);
                        if (_checked > -1) {
                            //remove id from selectedIds.
                            _proxy.getInterceptor(this, 'selectedRows').splice(_checked, 1);
                        }
                    }
                } else {
                    var _checked2 = _proxy.getInterceptor(this, 'selectedRows').indexOf(value);
                    if (_checked2 === -1) {
                        //add id to selectedIds.
                        _proxy.getInterceptor(this, 'selectedRows').push(value);
                    } else {
                        _proxy.getInterceptor(this, 'selectedRows').splice(_checked2, 1);
                    }
                }
            },
            define: {
                selectedRows: {
                    Value: _proxy.getInterceptor(_can2.default, 'List'),
                    Type: _proxy.getInterceptor(_can2.default, 'List')
                },
                additionalData: {
                    value: null
                },
                additionalDataName: {
                    type: "string",
                    value: null
                },
                read: {
                    type: "string",
                    value: null
                },
                readType: {
                    type: "string",
                    value: "POST"
                },
                loading: {
                    get: function get(_lastSet, resolve) {
                        var promise = _proxy.getInterceptor(this, 'request');

                        if (promise.state() === "pending") {
                            promise.always(function () {
                                resolve(false);
                            });
                            return true;
                        } else {
                            return false;
                        }
                    }
                },
                paginatedItems: {
                    get: function get(_lastSet, resolve) {
                        var _this = this;

                        var promise = _proxy.getInterceptor(this, 'request');

                        promise.done(function (data) {
                            _proxy.setInterceptor(_this, 'count', _proxy.getInterceptor(data, 'totalCount'));
                            resolve(_proxy.getInterceptor(data, 'items'));
                        });
                    }
                },
                requestOptions: {
                    type: '*',
                    get: function get() {
                        var ajaxOptions = {
                            url: _proxy.getInterceptor(this, 'read'),
                            method: _proxy.getInterceptor(this, 'readType'),
                            traditional: true,
                            dataType: _proxy.getInterceptor(this, 'dataType'),
                            contentType: _proxy.getInterceptor(this, 'contentType')
                        };
                        var data = _proxy.getInterceptor(this, 'additionalData');
                        if (data === null) {
                            data = {};
                        }
                        if (_proxy.getInterceptor(data, 'serialize')) data = data.serialize();
                        if (_proxy.getInterceptor(this, 'additionalDataName')) {
                            var result = {};
                            _proxy.setInterceptor(result, _proxy.getInterceptor(this, 'additionalDataName'), data);
                            _proxy.setInterceptor(ajaxOptions, 'data', result);
                        } else {
                            _proxy.setInterceptor(ajaxOptions, 'data', data);
                        }
                        _proxy.setInterceptor(_proxy.getInterceptor(ajaxOptions, 'data'), _proxy.getInterceptor(this, 'limitName'), _proxy.getInterceptor(this, 'limit'));
                        _proxy.setInterceptor(_proxy.getInterceptor(ajaxOptions, 'data'), _proxy.getInterceptor(this, 'currentPageName'), _proxy.getInterceptor(this, 'currentPage'));
                        if (_proxy.getInterceptor(this, 'stringify')) {
                            _proxy.setInterceptor(ajaxOptions, 'data', JSON.stringify(_proxy.getInterceptor(ajaxOptions, 'data')));
                        }
                        return ajaxOptions;
                    }
                },
                request: {
                    get: function get(_requestOptions) {
                        return (0, _http2.default)(_proxy.getInterceptor(this, 'requestOptions'));
                    }
                },
                count: {
                    type: "number",
                    value: 0
                },
                offset: {
                    type: "number",
                    value: 0
                },
                limit: {
                    type: "number",
                    value: 10
                },
                limitName: {
                    type: 'string',
                    value: 'limit'
                },
                currentPageName: {
                    type: 'string',
                    value: 'currentPage'
                },
                dataType: {
                    type: 'string',
                    value: 'json'
                },
                contentType: {
                    type: 'string',
                    value: 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                stringify: {
                    type: 'boolean',
                    value: false
                },
                canNext: {
                    get: function get() {
                        var cannext = _proxy.getInterceptor(this, 'offset') < _proxy.getInterceptor(this, 'count') - _proxy.getInterceptor(this, 'limit');
                        return cannext;
                    }
                },
                canPrev: {
                    get: function get() {
                        var canprev = _proxy.getInterceptor(this, 'offset') > 0;
                        return canprev;
                    }
                },
                currentPage: {
                    get: function get() {
                        return Math.floor(_proxy.getInterceptor(this, 'offset') / _proxy.getInterceptor(this, 'limit')) + 1;
                    },
                    set: function set(newVal) {
                        _proxy.setInterceptor(this, 'offset', (parseInt(newVal, 10) - 1) * _proxy.getInterceptor(this, 'limit'));
                    }
                },
                pageCount: {
                    get: function get() {
                        return _proxy.getInterceptor(this, 'count') ? Math.ceil(_proxy.getInterceptor(this, 'count') / _proxy.getInterceptor(this, 'limit')) : null;
                    }
                },
                hasPages: {
                    get: function get() {
                        return _proxy.getInterceptor(this, 'pageCount') > 1;
                    }
                },
                pageLimit: {
                    type: "number",
                    value: 10
                },
                pages: {
                    get: function get() {
                        var currentPage = _proxy.getInterceptor(this, 'currentPage');
                        var pageCount = _proxy.getInterceptor(this, 'pageLimit');
                        var pageOffset = currentPage - pageCount / 2 > 0 ? Math.ceil(currentPage - pageCount / 2) : 0;
                        var hasNonPage = true;
                        if (pageOffset + pageCount > _proxy.getInterceptor(this, 'pageCount')) {
                            pageCount = _proxy.getInterceptor(this, 'pageCount') - pageOffset;
                            hasNonPage = false;
                        }
                        return new (_proxy.getInterceptor(_can2.default, 'List'))(_underscore2.default.times(hasNonPage ? pageCount + 1 : pageCount, function (i) {
                            if (i < pageCount) {
                                return {
                                    pageNumber: pageOffset + i,
                                    pageTitle: pageOffset + i + 1,
                                    isActive: pageOffset + i + 1 === currentPage,
                                    isPage: true
                                };
                            } else {
                                return {
                                    pageTitle: '...',
                                    isPage: false
                                };
                            }
                        }));
                    }
                }
            }
        }),
        events: {
            '{selectedRows} change': function selectedRowsChange() {
                _proxy.getInterceptor(this, 'element').trigger('selectedrows', [{ selectedIds: _proxy.getInterceptor(_proxy.getInterceptor(this, 'viewModel'), 'selectedRows').attr() }]);
            },
            '{element} refresh': function elementRefresh() {
                _proxy.setInterceptor(_proxy.getInterceptor(this, 'viewModel'), 'request', _proxy.getInterceptor(_proxy.getInterceptor(this, 'viewModel'), 'requestOptions'));
            },
            '{element} clear': function elementClear() {
                _proxy.setInterceptor(_proxy.getInterceptor(this, 'viewModel'), 'selectedRows', []);
                _proxy.getInterceptor(this, 'element').trigger('refresh');
            },
            "{viewModel} additionalData set": 'resetGrid',
            "{additionalData} change": 'resetGrid',
            resetGrid: function resetGrid() {
                _proxy.setInterceptor(_proxy.getInterceptor(this, 'viewModel'), 'currentPage', 1);
            }
        }
    });
});
//# sourceMappingURL=ajax.pager.js.map
