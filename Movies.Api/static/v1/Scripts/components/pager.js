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
    }exports.default = _proxy.getInterceptor(_can2.default, "Component").extend({
        tag: "pager",
        template: "<content/>",
        viewModel: _proxy.getInterceptor(_can2.default, "Map").extend({
            prev: function prev() {
                if (_proxy.getInterceptor(this, "canPrev") === true) {
                    _proxy.setInterceptor(this, "offset", _proxy.getInterceptor(this, "offset") - _proxy.getInterceptor(this, "limit"));
                }
            },
            next: function next() {
                if (_proxy.getInterceptor(this, "canNext") === true) {
                    _proxy.setInterceptor(this, "offset", _proxy.getInterceptor(this, "offset") + _proxy.getInterceptor(this, "limit"));
                }
            },
            changePage: function changePage(pageNumber) {
                _proxy.setInterceptor(this, "currentPage", pageNumber);
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
                items: {
                    Type: _proxy.getInterceptor(_can2.default, "List"),
                    Value: _proxy.getInterceptor(_can2.default, "List")
                },
                paginatedItems: {
                    get: function get() {
                        if (_proxy.getInterceptor(_proxy.getInterceptor(this, "items"), "length") > 0) {
                            var pagedResults = Enumerable.From(_proxy.getInterceptor(this, "items")).Skip(_proxy.getInterceptor(this, "offset")).Take(_proxy.getInterceptor(this, "limit")).ToArray();
                            return pagedResults;
                        } else return [];
                    }
                },
                count: {
                    get: function get() {
                        return _proxy.getInterceptor(_proxy.getInterceptor(this, "items"), "length");
                    }
                },
                offset: {
                    type: "number",
                    value: 0
                },
                limit: {
                    type: "number",
                    value: 10
                },
                canNext: {
                    get: function get() {
                        var cannext = _proxy.getInterceptor(this, "offset") < _proxy.getInterceptor(this, "count") - _proxy.getInterceptor(this, "limit");
                        return cannext;
                    }
                },
                canPrev: {
                    get: function get() {
                        var canprev = _proxy.getInterceptor(this, "offset") > 0;
                        return canprev;
                    }
                },
                currentPage: {
                    get: function get() {
                        return Math.floor(_proxy.getInterceptor(this, "offset") / _proxy.getInterceptor(this, "limit")) + 1;
                    },
                    set: function set(newVal) {
                        _proxy.setInterceptor(this, "offset", (parseInt(newVal, 10) - 1) * _proxy.getInterceptor(this, "limit"));
                    }
                },
                pageCount: {
                    get: function get() {
                        return _proxy.getInterceptor(this, "count") ? Math.ceil(_proxy.getInterceptor(this, "count") / _proxy.getInterceptor(this, "limit")) : null;
                    }
                },
                hasPages: {
                    get: function get() {
                        return _proxy.getInterceptor(this, "pageCount") > 1;
                    }
                },
                pageLimit: {
                    type: "number",
                    value: 10
                },
                pages: {
                    get: function get() {
                        var currentPage = _proxy.getInterceptor(this, "currentPage");
                        var pageCount = _proxy.getInterceptor(this, "pageLimit");
                        var pageOffset = currentPage - pageCount / 2 > 0 ? Math.ceil(currentPage - pageCount / 2) : 0;
                        var hasNonPage = true;
                        if (pageOffset + pageCount > _proxy.getInterceptor(this, "pageCount")) {
                            pageCount = _proxy.getInterceptor(this, "pageCount") - pageOffset;
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
            '{element} clear': function elementClear() {
                _proxy.setInterceptor(_proxy.getInterceptor(this, "viewModel"), "selectedRows", []);
            },
            '{items} add': function itemsAdd() {
                _proxy.setInterceptor(_proxy.getInterceptor(this, "viewModel"), "currentPage", 1);
            },
            '{items} remove': function itemsRemove() {
                _proxy.setInterceptor(_proxy.getInterceptor(this, "viewModel"), "currentPage", 1);
            },
            "{viewModel} items set": function viewModelItemsSet() {
                _proxy.setInterceptor(_proxy.getInterceptor(this, "viewModel"), "currentPage", 1);
            }
        }
    });
});
//# sourceMappingURL=pager.js.map
