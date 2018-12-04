define(["exports", "can.full", "jquery", "underscore"], function (exports, _can, _jquery, _underscore) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _can2 = _interopRequireDefault(_can);

    var _jquery2 = _interopRequireDefault(_jquery);

    var _underscore2 = _interopRequireDefault(_underscore);

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
    }exports.default = _proxy.getInterceptor(_can2.default, "Component").extend({
        tag: "ajax-pager",
        template: "<content/>",
        viewModel: _proxy.getInterceptor(_can2.default, "Map").extend({
            Prev: function Prev() {
                if (_proxy.getInterceptor(this, "CanPrev") === true) {
                    _proxy.setInterceptor(this, "Offset", _proxy.getInterceptor(this, "Offset") - _proxy.getInterceptor(this, "limit"));
                }
            },
            Next: function Next() {
                if (_proxy.getInterceptor(this, "CanNext") === true) {
                    _proxy.setInterceptor(this, "Offset", _proxy.getInterceptor(this, "Offset") + _proxy.getInterceptor(this, "limit"));
                }
            },
            ChangePage: function ChangePage(pageNumber) {
                _proxy.setInterceptor(this, "CurrentPage", pageNumber);
            },
            isToggled: function isToggled(value) {
                var checked = _proxy.getInterceptor(this, "selectedRows").indexOf(value);
                //set checked based on if current checkbox's value is in selectedIds.
                return checked > -1;
            },
            toggle: function toggle(value, _toggle) {
                if (_toggle !== undefined && _toggle !== null) {
                    if (_toggle === true) {
                        var checked = _proxy.getInterceptor(this, "selectedRows").indexOf(value);
                        if (checked === -1) {
                            //add id to selectedIds.
                            _proxy.getInterceptor(this, "selectedRows").push(value);
                        }
                    } else {
                        var _checked = _proxy.getInterceptor(this, "selectedRows").indexOf(value);
                        if (_checked > -1) {
                            //remove id from selectedIds.
                            _proxy.getInterceptor(this, "selectedRows").splice(_checked, 1);
                        }
                    }
                } else {
                    var _checked2 = _proxy.getInterceptor(this, "selectedRows").indexOf(value);
                    if (_checked2 === -1) {
                        //add id to selectedIds.
                        _proxy.getInterceptor(this, "selectedRows").push(value);
                    } else {
                        _proxy.getInterceptor(this, "selectedRows").splice(_checked2, 1);
                    }
                }
            },
            define: {
                selectedRows: {
                    Value: _proxy.getInterceptor(_can2.default, "List"),
                    Type: _proxy.getInterceptor(_can2.default, "List")
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
                Loading: {
                    get: function get(_lastSet, resolve) {
                        var promise = _proxy.getInterceptor(this, "request");

                        if (promise.state() === "pending") {
                            promise.then(function () {
                                resolve(false);
                            });
                            return true;
                        } else {
                            return false;
                        }
                    }
                },
                PaginatedItems: {
                    get: function get(_lastSet, resolve) {
                        var _this = this;

                        var promise = _proxy.getInterceptor(this, "request");

                        promise.done(function (data) {
                            _proxy.setInterceptor(_this, "Count", _proxy.getInterceptor(data, "TotalCount"));
                            resolve(_proxy.getInterceptor(data, "Items"));
                        });
                    }
                },
                requestOptions: {
                    type: '*',
                    get: function get() {
                        var ajaxOptions = {
                            url: _proxy.getInterceptor(this, "read"),
                            method: _proxy.getInterceptor(this, "readType"),
                            traditional: true,
                            dataType: _proxy.getInterceptor(this, "dataType"),
                            contentType: _proxy.getInterceptor(this, "contentType")
                        };
                        var data = _proxy.getInterceptor(this, "additionalData");
                        if (data === null) {
                            data = {};
                        }
                        if (_proxy.getInterceptor(data, "serialize")) data = data.serialize();
                        if (_proxy.getInterceptor(this, "additionalDataName")) {
                            var result = {};
                            _proxy.setInterceptor(result, _proxy.getInterceptor(this, "additionalDataName"), data);
                            _proxy.setInterceptor(ajaxOptions, "data", result);
                        } else {
                            _proxy.setInterceptor(ajaxOptions, "data", data);
                        }
                        _proxy.setInterceptor(_proxy.getInterceptor(ajaxOptions, "data"), _proxy.getInterceptor(this, "limitName"), _proxy.getInterceptor(this, "limit"));
                        _proxy.setInterceptor(_proxy.getInterceptor(ajaxOptions, "data"), _proxy.getInterceptor(this, "currentPageName"), _proxy.getInterceptor(this, "CurrentPage"));
                        if (_proxy.getInterceptor(this, "stringify")) {
                            _proxy.setInterceptor(ajaxOptions, "data", JSON.stringify(_proxy.getInterceptor(ajaxOptions, "data")));
                        }
                        return ajaxOptions;
                    }
                },
                request: {
                    get: function get(_requestOptions) {
                        return _jquery2.default.ajax(_proxy.getInterceptor(this, "requestOptions"));
                    }
                },
                Count: {
                    type: "number",
                    value: 0
                },
                Offset: {
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
                CanNext: {
                    get: function get() {
                        var cannext = _proxy.getInterceptor(this, "Offset") < _proxy.getInterceptor(this, "Count") - _proxy.getInterceptor(this, "limit");
                        return cannext;
                    }
                },
                CanPrev: {
                    get: function get() {
                        var canprev = _proxy.getInterceptor(this, "Offset") > 0;
                        return canprev;
                    }
                },
                CurrentPage: {
                    get: function get() {
                        return Math.floor(_proxy.getInterceptor(this, "Offset") / _proxy.getInterceptor(this, "limit")) + 1;
                    },
                    set: function set(newVal) {
                        _proxy.setInterceptor(this, "Offset", (parseInt(newVal, 10) - 1) * _proxy.getInterceptor(this, "limit"));
                    }
                },
                PageCount: {
                    get: function get() {
                        return _proxy.getInterceptor(this, "Count") ? Math.ceil(_proxy.getInterceptor(this, "Count") / _proxy.getInterceptor(this, "limit")) : null;
                    }
                },
                HasPages: {
                    get: function get() {
                        return _proxy.getInterceptor(this, "PageCount") > 1;
                    }
                },
                pageLimit: {
                    type: "number",
                    value: 10
                },
                Pages: {
                    get: function get() {
                        var currentPage = _proxy.getInterceptor(this, "CurrentPage");
                        var pageCount = _proxy.getInterceptor(this, "pageLimit");
                        var pageOffset = currentPage - pageCount / 2 > 0 ? Math.ceil(currentPage - pageCount / 2) : 0;
                        var hasNonPage = true;
                        if (pageOffset + pageCount > _proxy.getInterceptor(this, "PageCount")) {
                            pageCount = _proxy.getInterceptor(this, "PageCount") - pageOffset;
                            hasNonPage = false;
                        }
                        return new (_proxy.getInterceptor(_can2.default, "List"))(_underscore2.default.times(hasNonPage ? pageCount + 1 : pageCount, function (i) {
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
                _proxy.getInterceptor(this, "element").trigger('selectedrows', [{ selectedIds: _proxy.getInterceptor(_proxy.getInterceptor(this, "viewModel"), "selectedRows").serialize() }]);
            },
            '{element} refresh': function elementRefresh() {
                _proxy.setInterceptor(_proxy.getInterceptor(this, "viewModel"), "request", _proxy.getInterceptor(_proxy.getInterceptor(this, "viewModel"), "requestOptions"));
            },
            '{element} clear': function elementClear() {
                _proxy.setInterceptor(_proxy.getInterceptor(this, "viewModel"), "selectedRows", []);
                _proxy.getInterceptor(this, "element").trigger('refresh');
            },
            "{viewModel} additionalData set": 'resetGrid',
            "{additionalData} change": 'resetGrid',
            resetGrid: function resetGrid() {
                _proxy.setInterceptor(_proxy.getInterceptor(this, "viewModel"), "CurrentPage", 1);
            }
        }
    });
});
