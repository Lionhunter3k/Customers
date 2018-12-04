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
        tag: "pager",
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
                items: {
                    Type: _proxy.getInterceptor(_can2.default, "List"),
                    Value: _proxy.getInterceptor(_can2.default, "List")
                },
                PaginatedItems: {
                    get: function get() {
                        if (_proxy.getInterceptor(_proxy.getInterceptor(this, "items"), "length") > 0) {
                            var pagedResults = Enumerable.From(_proxy.getInterceptor(this, "items")).Skip(_proxy.getInterceptor(this, "Offset")).Take(_proxy.getInterceptor(this, "limit")).ToArray();
                            return pagedResults;
                        } else return [];
                    }
                },
                Count: {
                    get: function get() {
                        return _proxy.getInterceptor(_proxy.getInterceptor(this, "items"), "length");
                    }
                },
                Offset: {
                    type: "number",
                    value: 0
                },
                limit: {
                    type: "number",
                    value: 10
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
            '{element} clear': function elementClear() {
                _proxy.setInterceptor(_proxy.getInterceptor(this, "viewModel"), "selectedRows", []);
            },
            '{items} add': function itemsAdd() {
                _proxy.setInterceptor(_proxy.getInterceptor(this, "viewModel"), "CurrentPage", 1);
            },
            '{items} remove': function itemsRemove() {
                _proxy.setInterceptor(_proxy.getInterceptor(this, "viewModel"), "CurrentPage", 1);
            },
            "{viewModel} items set": function viewModelItemsSet() {
                _proxy.setInterceptor(_proxy.getInterceptor(this, "viewModel"), "CurrentPage", 1);
            }
        }
    });
});