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
                if (object.attr && object._data && object._data[propertyName]) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFqYXgucGFnZXIuZXM2LmpzIl0sIm5hbWVzIjpbIndpbmRvdyIsIl9wcm94eSIsImdldEludGVyY2VwdG9yIiwib2JqZWN0IiwicHJvcGVydHlOYW1lIiwiYXR0ciIsIl9kYXRhIiwic2V0SW50ZXJjZXB0b3IiLCJ2YWx1ZSIsInVwZGF0ZVBvc3RmaXhBZGRJbnRlcmNlcHRvciIsIm9yaWdpbmFsIiwidXBkYXRlUG9zdGZpeFN1YnRyYWN0SW50ZXJjZXB0b3IiLCJleHRlbmQiLCJ0YWciLCJ0ZW1wbGF0ZSIsInZpZXdNb2RlbCIsIlByZXYiLCJOZXh0IiwiQ2hhbmdlUGFnZSIsInBhZ2VOdW1iZXIiLCJpc1RvZ2dsZWQiLCJjaGVja2VkIiwiaW5kZXhPZiIsInRvZ2dsZSIsInVuZGVmaW5lZCIsInB1c2giLCJzcGxpY2UiLCJkZWZpbmUiLCJzZWxlY3RlZFJvd3MiLCJWYWx1ZSIsImNhbiIsIlR5cGUiLCJhZGRpdGlvbmFsRGF0YSIsImFkZGl0aW9uYWxEYXRhTmFtZSIsInR5cGUiLCJyZWFkIiwicmVhZFR5cGUiLCJMb2FkaW5nIiwiZ2V0IiwiX2xhc3RTZXQiLCJyZXNvbHZlIiwicHJvbWlzZSIsInN0YXRlIiwidGhlbiIsIlBhZ2luYXRlZEl0ZW1zIiwiZG9uZSIsImRhdGEiLCJyZXF1ZXN0T3B0aW9ucyIsImFqYXhPcHRpb25zIiwidXJsIiwibWV0aG9kIiwidHJhZGl0aW9uYWwiLCJkYXRhVHlwZSIsImNvbnRlbnRUeXBlIiwic2VyaWFsaXplIiwicmVzdWx0IiwiSlNPTiIsInN0cmluZ2lmeSIsInJlcXVlc3QiLCJfcmVxdWVzdE9wdGlvbnMiLCIkIiwiYWpheCIsIkNvdW50IiwiT2Zmc2V0IiwibGltaXQiLCJsaW1pdE5hbWUiLCJjdXJyZW50UGFnZU5hbWUiLCJDYW5OZXh0IiwiY2FubmV4dCIsIkNhblByZXYiLCJjYW5wcmV2IiwiQ3VycmVudFBhZ2UiLCJNYXRoIiwiZmxvb3IiLCJzZXQiLCJuZXdWYWwiLCJwYXJzZUludCIsIlBhZ2VDb3VudCIsImNlaWwiLCJIYXNQYWdlcyIsInBhZ2VMaW1pdCIsIlBhZ2VzIiwiY3VycmVudFBhZ2UiLCJwYWdlQ291bnQiLCJwYWdlT2Zmc2V0IiwiaGFzTm9uUGFnZSIsIl8iLCJ0aW1lcyIsImkiLCJwYWdlVGl0bGUiLCJpc0FjdGl2ZSIsImlzUGFnZSIsImV2ZW50cyIsInRyaWdnZXIiLCJzZWxlY3RlZElkcyIsInJlc2V0R3JpZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFDLFFBQUksQ0FBQ0EsT0FBT0MsTUFBWixFQUFvQjtBQUNqQkQsZUFBT0MsTUFBUCxHQUFnQjtBQUNaQyw0QkFBZ0Isd0JBQVVDLE1BQVYsRUFBa0JDLFlBQWxCLEVBQWdDO0FBQzVDLG9CQUFJRCxPQUFPRSxJQUFQLElBQWVGLE9BQU9HLEtBQXRCLElBQStCSCxPQUFPRyxLQUFQLENBQWFGLFlBQWIsQ0FBbkMsRUFBK0Q7QUFDM0QsMkJBQU9ELE9BQU9FLElBQVAsQ0FBWUQsWUFBWixDQUFQO0FBQ0gsaUJBQ0QsT0FBT0QsT0FBT0MsWUFBUCxDQUFQO0FBQ0gsYUFOVyxFQU9aRyxnQkFBZ0Isd0JBQVVKLE1BQVYsRUFBa0JDLFlBQWxCLEVBQWdDSSxLQUFoQyxFQUF1QztBQUNuRCxvQkFBSUwsT0FBT0UsSUFBWCxFQUFpQjtBQUNiLDJCQUFPRixPQUFPRSxJQUFQLENBQVlELFlBQVosRUFBMEJJLEtBQTFCLENBQVA7QUFDSCxpQkFGRCxNQUdLO0FBQ0QsMkJBQU9MLE9BQU9DLFlBQVAsSUFBdUJJLEtBQTlCO0FBQ0g7QUFDSixhQWRXLEVBZVpDLDZCQUE2QixxQ0FBVU4sTUFBVixFQUFrQkMsWUFBbEIsRUFBZ0M7QUFDekQsb0JBQUlNLFdBQVcsS0FBS1IsY0FBTCxDQUFvQkMsTUFBcEIsRUFBNEJDLFlBQTVCLENBQWYsQ0FDQSxLQUFLRyxjQUFMLENBQW9CSixNQUFwQixFQUE0QkMsWUFBNUIsRUFBMENNLFdBQVcsQ0FBckQsRUFDQSxPQUFPQSxRQUFQO0FBQ0gsYUFuQlcsRUFvQlpDLGtDQUFrQywwQ0FB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QUFRO0FBRkwsaUNBQVA7QUFJSDtBQUNKLHlCQWZtQixDQUFiLENBQVA7QUFnQkg7QUExQkU7QUFwSkg7QUEvQ2MsU0FBZixDQUhxQjtBQW9PaENDLGdCQUFRO0FBQ0oscUNBQXlCLDhCQUFZO0FBQ2pDLHVEQUFhQyxPQUFiLENBQXFCLGNBQXJCLEVBQXFDLENBQUMsRUFBRUMsYUFBYSxnRkFBNEJ4QyxTQUE1QixFQUFmLEVBQUQsQ0FBckM7QUFDSCxhQUhHO0FBSUosaUNBQXFCLDBCQUFZO0FBQzdCLHVJQUF5QixJQUF6QjtBQUNILGFBTkc7QUFPSiwrQkFBbUIsd0JBQVk7QUFDM0IsZ0dBQThCLEVBQTlCO0FBQ0EsdURBQWF1QyxPQUFiLENBQXFCLFNBQXJCO0FBQ0gsYUFWRztBQVdKLDhDQUFrQyxXQVg5QjtBQVlKLHVDQUEyQixXQVp2QjtBQWFKRSx1QkFBVyxxQkFBWTtBQUNuQiwrRkFBNkIsQ0FBN0I7QUFDSDtBQWZHO0FBcE93QixLQUFyQixDIiwiZmlsZSI6ImFqYXgucGFnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyLvu79pbXBvcnQgY2FuIGZyb20gXCJjYW4uZnVsbFwiO1xyXG5pbXBvcnQgJCBmcm9tIFwianF1ZXJ5XCI7XHJcbmltcG9ydCBfIGZyb20gJ3VuZGVyc2NvcmUnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2FuLkNvbXBvbmVudC5leHRlbmQoe1xyXG4gICAgdGFnOiBcImFqYXgtcGFnZXJcIixcclxuICAgIHRlbXBsYXRlOiBcIjxjb250ZW50Lz5cIixcclxuICAgIHZpZXdNb2RlbDogY2FuLk1hcC5leHRlbmQoe1xyXG4gICAgICAgIFByZXY6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuQ2FuUHJldiA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5PZmZzZXQgPSB0aGlzLk9mZnNldCAtIHRoaXMubGltaXQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIE5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuQ2FuTmV4dCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5PZmZzZXQgPSB0aGlzLk9mZnNldCArIHRoaXMubGltaXQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIENoYW5nZVBhZ2U6IGZ1bmN0aW9uIChwYWdlTnVtYmVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuQ3VycmVudFBhZ2UgPSBwYWdlTnVtYmVyO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaXNUb2dnbGVkOiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgbGV0IGNoZWNrZWQgPSB0aGlzLnNlbGVjdGVkUm93cy5pbmRleE9mKHZhbHVlKTtcclxuICAgICAgICAgICAgLy9zZXQgY2hlY2tlZCBiYXNlZCBvbiBpZiBjdXJyZW50IGNoZWNrYm94J3MgdmFsdWUgaXMgaW4gc2VsZWN0ZWRJZHMuXHJcbiAgICAgICAgICAgIHJldHVybiBjaGVja2VkID4gLTE7XHJcbiAgICAgICAgfSxcclxuICAgICAgICB0b2dnbGU6IGZ1bmN0aW9uICh2YWx1ZSwgdG9nZ2xlKSB7XHJcbiAgICAgICAgICAgIGlmICh0b2dnbGUgIT09IHVuZGVmaW5lZCAmJiB0b2dnbGUgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0b2dnbGUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgY2hlY2tlZCA9IHRoaXMuc2VsZWN0ZWRSb3dzLmluZGV4T2YodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGVja2VkID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2FkZCBpZCB0byBzZWxlY3RlZElkcy5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFJvd3MucHVzaCh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNoZWNrZWQgPSB0aGlzLnNlbGVjdGVkUm93cy5pbmRleE9mKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2hlY2tlZCA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vcmVtb3ZlIGlkIGZyb20gc2VsZWN0ZWRJZHMuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRSb3dzLnNwbGljZShjaGVja2VkLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2hlY2tlZCA9IHRoaXMuc2VsZWN0ZWRSb3dzLmluZGV4T2YodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNoZWNrZWQgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9hZGQgaWQgdG8gc2VsZWN0ZWRJZHMuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFJvd3MucHVzaCh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkUm93cy5zcGxpY2UoY2hlY2tlZCwgMSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlZmluZToge1xyXG4gICAgICAgICAgICBzZWxlY3RlZFJvd3M6IHtcclxuICAgICAgICAgICAgICAgIFZhbHVlOiBjYW4uTGlzdCxcclxuICAgICAgICAgICAgICAgIFR5cGU6IGNhbi5MaXN0XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGFkZGl0aW9uYWxEYXRhOiB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogbnVsbFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBhZGRpdGlvbmFsRGF0YU5hbWU6IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwic3RyaW5nXCIsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogbnVsbFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICByZWFkOiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcInN0cmluZ1wiLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IG51bGxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcmVhZFR5cGU6IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwic3RyaW5nXCIsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogXCJQT1NUXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgTG9hZGluZzoge1xyXG4gICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoX2xhc3RTZXQsIHJlc29sdmUpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcHJvbWlzZSA9IHRoaXMucmVxdWVzdDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb21pc2Uuc3RhdGUoKSA9PT0gXCJwZW5kaW5nXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgUGFnaW5hdGVkSXRlbXM6IHtcclxuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKF9sYXN0U2V0LCByZXNvbHZlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHByb21pc2UgPSB0aGlzLnJlcXVlc3Q7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHByb21pc2UuZG9uZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkNvdW50ID0gZGF0YS5Ub3RhbENvdW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEuSXRlbXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICByZXF1ZXN0T3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJyonLFxyXG4gICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGFqYXhPcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IHRoaXMucmVhZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiB0aGlzLnJlYWRUeXBlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFkaXRpb25hbDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6IHRoaXMuZGF0YVR5cGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlOiB0aGlzLmNvbnRlbnRUeXBlXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZGF0YSA9IHRoaXMuYWRkaXRpb25hbERhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zZXJpYWxpemUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSBkYXRhLnNlcmlhbGl6ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmFkZGl0aW9uYWxEYXRhTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzdWx0ID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFt0aGlzLmFkZGl0aW9uYWxEYXRhTmFtZV0gPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhamF4T3B0aW9ucy5kYXRhID0gcmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWpheE9wdGlvbnMuZGF0YSA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGFqYXhPcHRpb25zLmRhdGFbdGhpcy5saW1pdE5hbWVdID0gdGhpcy5saW1pdDtcclxuICAgICAgICAgICAgICAgICAgICBhamF4T3B0aW9ucy5kYXRhW3RoaXMuY3VycmVudFBhZ2VOYW1lXSA9IHRoaXMuQ3VycmVudFBhZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RyaW5naWZ5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFqYXhPcHRpb25zLmRhdGEgPSBKU09OLnN0cmluZ2lmeShhamF4T3B0aW9ucy5kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFqYXhPcHRpb25zO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICByZXF1ZXN0OiB7XHJcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uIChfcmVxdWVzdE9wdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJC5hamF4KHRoaXMucmVxdWVzdE9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBDb3VudDoge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJudW1iZXJcIixcclxuICAgICAgICAgICAgICAgIHZhbHVlOiAwXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIE9mZnNldDoge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJudW1iZXJcIixcclxuICAgICAgICAgICAgICAgIHZhbHVlOiAwXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGxpbWl0OiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcIm51bWJlclwiLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IDEwXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGxpbWl0TmFtZToge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogJ2xpbWl0J1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjdXJyZW50UGFnZU5hbWU6IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6ICdjdXJyZW50UGFnZSdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZGF0YVR5cGU6IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6ICdqc29uJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjb250ZW50VHlwZToge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDsgY2hhcnNldD1VVEYtOCdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3RyaW5naWZ5OiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnYm9vbGVhbicsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogZmFsc2VcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgQ2FuTmV4dDoge1xyXG4gICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNhbm5leHQgPSB0aGlzLk9mZnNldCA8IHRoaXMuQ291bnQgLSB0aGlzLmxpbWl0O1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYW5uZXh0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBDYW5QcmV2OiB7XHJcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgY2FucHJldiA9IHRoaXMuT2Zmc2V0ID4gMDtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FucHJldjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgQ3VycmVudFBhZ2U6IHtcclxuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLmZsb29yKHRoaXMuT2Zmc2V0IC8gdGhpcy5saW1pdCkgKyAxO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKG5ld1ZhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuT2Zmc2V0ID0gKHBhcnNlSW50KG5ld1ZhbCwgMTApIC0gMSkgKiB0aGlzLmxpbWl0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBQYWdlQ291bnQ6IHtcclxuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLkNvdW50ID9cclxuICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5jZWlsKHRoaXMuQ291bnQgLyB0aGlzLmxpbWl0KSA6IG51bGw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIEhhc1BhZ2VzOiB7XHJcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5QYWdlQ291bnQgPiAxO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBwYWdlTGltaXQ6IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwibnVtYmVyXCIsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogMTBcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgUGFnZXM6IHtcclxuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjdXJyZW50UGFnZSA9IHRoaXMuQ3VycmVudFBhZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBhZ2VDb3VudCA9IHRoaXMucGFnZUxpbWl0O1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBwYWdlT2Zmc2V0ID0gY3VycmVudFBhZ2UgLSAocGFnZUNvdW50IC8gMikgPiAwID8gTWF0aC5jZWlsKGN1cnJlbnRQYWdlIC0gKHBhZ2VDb3VudCAvIDIpKSA6IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhhc05vblBhZ2UgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwYWdlT2Zmc2V0ICsgcGFnZUNvdW50ID4gdGhpcy5QYWdlQ291bnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFnZUNvdW50ID0gdGhpcy5QYWdlQ291bnQgLSBwYWdlT2Zmc2V0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoYXNOb25QYWdlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgY2FuLkxpc3QoXy50aW1lcyhoYXNOb25QYWdlID8gcGFnZUNvdW50ICsgMSA6IHBhZ2VDb3VudCwgZnVuY3Rpb24gKGkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkgPCBwYWdlQ291bnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZU51bWJlcjogcGFnZU9mZnNldCArIGksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZVRpdGxlOiBwYWdlT2Zmc2V0ICsgaSArIDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNBY3RpdmU6IHBhZ2VPZmZzZXQgKyBpICsgMSA9PT0gY3VycmVudFBhZ2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNQYWdlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlVGl0bGU6ICcuLi4nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzUGFnZTogZmFsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KSxcclxuICAgIGV2ZW50czoge1xyXG4gICAgICAgICd7c2VsZWN0ZWRSb3dzfSBjaGFuZ2UnOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC50cmlnZ2VyKCdzZWxlY3RlZHJvd3MnLCBbeyBzZWxlY3RlZElkczogdGhpcy52aWV3TW9kZWwuc2VsZWN0ZWRSb3dzLnNlcmlhbGl6ZSgpIH1dKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgICd7ZWxlbWVudH0gcmVmcmVzaCc6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy52aWV3TW9kZWwucmVxdWVzdCA9IHRoaXMudmlld01vZGVsLnJlcXVlc3RPcHRpb25zO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgJ3tlbGVtZW50fSBjbGVhcic6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy52aWV3TW9kZWwuc2VsZWN0ZWRSb3dzID0gW107XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC50cmlnZ2VyKCdyZWZyZXNoJyk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInt2aWV3TW9kZWx9IGFkZGl0aW9uYWxEYXRhIHNldFwiOiAncmVzZXRHcmlkJyxcclxuICAgICAgICBcInthZGRpdGlvbmFsRGF0YX0gY2hhbmdlXCI6ICdyZXNldEdyaWQnLFxyXG4gICAgICAgIHJlc2V0R3JpZDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLnZpZXdNb2RlbC5DdXJyZW50UGFnZSA9IDE7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KTsiXX0=
