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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhZ2VyLmVzNi5qcyJdLCJuYW1lcyI6WyJ3aW5kb3ciLCJfcHJveHkiLCJnZXRJbnRlcmNlcHRvciIsIm9iamVjdCIsInByb3BlcnR5TmFtZSIsImF0dHIiLCJfZGF0YSIsInNldEludGVyY2VwdG9yIiwidmFsdWUiLCJ1cGRhdGVQb3N0Zml4QWRkSW50ZXJjZXB0b3IiLCJvcmlnaW5hbCIsInVwZGF0ZVBvc3RmaXhTdWJ0cmFjdEludGVyY2VwdG9yIiwiZXh0ZW5kIiwidGFnIiwidGVtcGxhdGUiLCJ2aWV3TW9kZWwiLCJQcmV2IiwiTmV4dCIsIkNoYW5nZVBhZ2UiLCJwYWdlTnVtYmVyIiwiaXNUb2dnbGVkIiwiY2hlY2tlZCIsImluZGV4T2YiLCJ0b2dnbGUiLCJ1bmRlZmluZWQiLCJwdXNoIiwic3BsaWNlIiwiZGVmaW5lIiwic2VsZWN0ZWRSb3dzIiwiVmFsdWUiLCJjYW4iLCJUeXBlIiwiaXRlbXMiLCJQYWdpbmF0ZWRJdGVtcyIsImdldCIsInBhZ2VkUmVzdWx0cyIsIkVudW1lcmFibGUiLCJGcm9tIiwiU2tpcCIsIlRha2UiLCJUb0FycmF5IiwiQ291bnQiLCJPZmZzZXQiLCJ0eXBlIiwibGltaXQiLCJDYW5OZXh0IiwiY2FubmV4dCIsIkNhblByZXYiLCJjYW5wcmV2IiwiQ3VycmVudFBhZ2UiLCJNYXRoIiwiZmxvb3IiLCJzZXQiLCJuZXdWYWwiLCJwYXJzZUludCIsIlBhZ2VDb3VudCIsImNlaWwiLCJIYXNQYWdlcyIsInBhZ2VMaW1pdCIsIlBhZ2VzIiwiY3VycmVudFBhZ2UiLCJwYWdlQ291bnQiLCJwYWdlT2Zmc2V0IiwiaGFzTm9uUGFnZSIsIl8iLCJ0aW1lcyIsImkiLCJwYWdlVGl0bGUiLCJpc0FjdGl2ZSIsImlzUGFnZSIsImV2ZW50cyIsInRyaWdnZXIiLCJzZWxlY3RlZElkcyIsInNlcmlhbGl6ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFDLFFBQUksQ0FBQ0EsT0FBT0MsTUFBWixFQUFvQjtBQUNqQkQs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O0FBQ0gxQyxnREFBWTJDLGFBQWFJLENBRHRCO0FBRUhDLCtDQUFXTCxhQUFhSSxDQUFiLEdBQWlCLENBRnpCO0FBR0hFLDhDQUFVTixhQUFhSSxDQUFiLEdBQWlCLENBQWpCLEtBQXVCTixXQUg5QjtBQUlIUyw0Q0FBUTtBQUpMLGlDQUFQO0FBTUgsNkJBUEQsTUFRSztBQUNELHVDQUFPO0FBQ0hGLCtDQUFXLEtBRFI7QUFFSEUsNENBQVE7QUFGTCxpQ0FBUDtBQUlIO0FBQ0oseUJBZm1CLENBQWIsQ0FBUDtBQWdCSDtBQTFCRTtBQW5FSDtBQS9DYyxTQUFmLENBSHFCO0FBbUpoQ0MsZ0JBQVE7QUFDSixxQ0FBeUIsOEJBQVk7QUFDakMsdURBQWFDLE9BQWIsQ0FBcUIsY0FBckIsRUFBcUMsQ0FBQyxFQUFFQyxhQUFhLGdGQUE0QkMsU0FBNUIsRUFBZixFQUFELENBQXJDO0FBQ0gsYUFIRztBQUlKLCtCQUFtQix3QkFBWTtBQUMzQixnR0FBOEIsRUFBOUI7QUFDSCxhQU5HO0FBT0osMkJBQWUsb0JBQVk7QUFDdkIsK0ZBQTZCLENBQTdCO0FBQ0gsYUFURztBQVVKLDhCQUFrQix1QkFBWTtBQUMxQiwrRkFBNkIsQ0FBN0I7QUFDSCxhQVpHO0FBYUoscUNBQXlCLDZCQUFZO0FBQ2pDLCtGQUE2QixDQUE3QjtBQUNIO0FBZkc7QUFuSndCLEtBQXJCLEMiLCJmaWxlIjoicGFnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyLvu79pbXBvcnQgY2FuIGZyb20gXCJjYW4uZnVsbFwiO1xyXG5pbXBvcnQgJCBmcm9tIFwianF1ZXJ5XCI7XHJcbmltcG9ydCBfIGZyb20gJ3VuZGVyc2NvcmUnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2FuLkNvbXBvbmVudC5leHRlbmQoe1xyXG4gICAgdGFnOiBcInBhZ2VyXCIsXHJcbiAgICB0ZW1wbGF0ZTogXCI8Y29udGVudC8+XCIsXHJcbiAgICB2aWV3TW9kZWw6IGNhbi5NYXAuZXh0ZW5kKHtcclxuICAgICAgICBQcmV2OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLkNhblByZXYgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuT2Zmc2V0ID0gdGhpcy5PZmZzZXQgLSB0aGlzLmxpbWl0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBOZXh0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLkNhbk5leHQgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuT2Zmc2V0ID0gdGhpcy5PZmZzZXQgKyB0aGlzLmxpbWl0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBDaGFuZ2VQYWdlOiBmdW5jdGlvbiAocGFnZU51bWJlcikge1xyXG4gICAgICAgICAgICB0aGlzLkN1cnJlbnRQYWdlID0gcGFnZU51bWJlcjtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGlzVG9nZ2xlZDogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIGxldCBjaGVja2VkID0gdGhpcy5zZWxlY3RlZFJvd3MuaW5kZXhPZih2YWx1ZSk7XHJcbiAgICAgICAgICAgIC8vc2V0IGNoZWNrZWQgYmFzZWQgb24gaWYgY3VycmVudCBjaGVja2JveCdzIHZhbHVlIGlzIGluIHNlbGVjdGVkSWRzLlxyXG4gICAgICAgICAgICByZXR1cm4gY2hlY2tlZCA+IC0xO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdG9nZ2xlOiBmdW5jdGlvbiAodmFsdWUsIHRvZ2dsZSkge1xyXG4gICAgICAgICAgICBpZiAodG9nZ2xlICE9PSB1bmRlZmluZWQgJiYgdG9nZ2xlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodG9nZ2xlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNoZWNrZWQgPSB0aGlzLnNlbGVjdGVkUm93cy5pbmRleE9mKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2hlY2tlZCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9hZGQgaWQgdG8gc2VsZWN0ZWRJZHMuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRSb3dzLnB1c2godmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjaGVja2VkID0gdGhpcy5zZWxlY3RlZFJvd3MuaW5kZXhPZih2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoZWNrZWQgPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL3JlbW92ZSBpZCBmcm9tIHNlbGVjdGVkSWRzLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkUm93cy5zcGxpY2UoY2hlY2tlZCwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNoZWNrZWQgPSB0aGlzLnNlbGVjdGVkUm93cy5pbmRleE9mKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIGlmIChjaGVja2VkID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vYWRkIGlkIHRvIHNlbGVjdGVkSWRzLlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRSb3dzLnB1c2godmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFJvd3Muc3BsaWNlKGNoZWNrZWQsIDEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZWZpbmU6IHtcclxuICAgICAgICAgICAgc2VsZWN0ZWRSb3dzOiB7XHJcbiAgICAgICAgICAgICAgICBWYWx1ZTogY2FuLkxpc3QsXHJcbiAgICAgICAgICAgICAgICBUeXBlOiBjYW4uTGlzdFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBpdGVtczoge1xyXG4gICAgICAgICAgICAgICAgVHlwZTogY2FuLkxpc3QsXHJcbiAgICAgICAgICAgICAgICBWYWx1ZTogY2FuLkxpc3RcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgUGFnaW5hdGVkSXRlbXM6IHtcclxuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLml0ZW1zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBhZ2VkUmVzdWx0cyA9IEVudW1lcmFibGUuRnJvbSh0aGlzLml0ZW1zKS5Ta2lwKHRoaXMuT2Zmc2V0KS5UYWtlKHRoaXMubGltaXQpLlRvQXJyYXkoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhZ2VkUmVzdWx0cztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gW107XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIENvdW50OiB7XHJcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5pdGVtcy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIE9mZnNldDoge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJudW1iZXJcIixcclxuICAgICAgICAgICAgICAgIHZhbHVlOiAwXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGxpbWl0OiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcIm51bWJlclwiLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IDEwXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIENhbk5leHQ6IHtcclxuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjYW5uZXh0ID0gdGhpcy5PZmZzZXQgPCB0aGlzLkNvdW50IC0gdGhpcy5saW1pdDtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FubmV4dDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgQ2FuUHJldjoge1xyXG4gICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNhbnByZXYgPSB0aGlzLk9mZnNldCA+IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbnByZXY7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIEN1cnJlbnRQYWdlOiB7XHJcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vcih0aGlzLk9mZnNldCAvIHRoaXMubGltaXQpICsgMTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChuZXdWYWwpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLk9mZnNldCA9IChwYXJzZUludChuZXdWYWwsIDEwKSAtIDEpICogdGhpcy5saW1pdDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgUGFnZUNvdW50OiB7XHJcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5Db3VudCA/XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE1hdGguY2VpbCh0aGlzLkNvdW50IC8gdGhpcy5saW1pdCkgOiBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBIYXNQYWdlczoge1xyXG4gICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuUGFnZUNvdW50ID4gMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcGFnZUxpbWl0OiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcIm51bWJlclwiLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IDEwXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFBhZ2VzOiB7XHJcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgY3VycmVudFBhZ2UgPSB0aGlzLkN1cnJlbnRQYWdlO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBwYWdlQ291bnQgPSB0aGlzLnBhZ2VMaW1pdDtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcGFnZU9mZnNldCA9IGN1cnJlbnRQYWdlIC0gKHBhZ2VDb3VudCAvIDIpID4gMCA/IE1hdGguY2VpbChjdXJyZW50UGFnZSAtIChwYWdlQ291bnQgLyAyKSkgOiAwO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBoYXNOb25QYWdlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocGFnZU9mZnNldCArIHBhZ2VDb3VudCA+IHRoaXMuUGFnZUNvdW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2VDb3VudCA9IHRoaXMuUGFnZUNvdW50IC0gcGFnZU9mZnNldDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGFzTm9uUGFnZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IGNhbi5MaXN0KF8udGltZXMoaGFzTm9uUGFnZSA/IHBhZ2VDb3VudCArIDEgOiBwYWdlQ291bnQsIGZ1bmN0aW9uIChpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpIDwgcGFnZUNvdW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2VOdW1iZXI6IHBhZ2VPZmZzZXQgKyBpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2VUaXRsZTogcGFnZU9mZnNldCArIGkgKyAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzQWN0aXZlOiBwYWdlT2Zmc2V0ICsgaSArIDEgPT09IGN1cnJlbnRQYWdlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzUGFnZTogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZVRpdGxlOiAnLi4uJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1BhZ2U6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSksXHJcbiAgICBldmVudHM6IHtcclxuICAgICAgICAne3NlbGVjdGVkUm93c30gY2hhbmdlJzogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQudHJpZ2dlcignc2VsZWN0ZWRyb3dzJywgW3sgc2VsZWN0ZWRJZHM6IHRoaXMudmlld01vZGVsLnNlbGVjdGVkUm93cy5zZXJpYWxpemUoKSB9XSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICAne2VsZW1lbnR9IGNsZWFyJzogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLnZpZXdNb2RlbC5zZWxlY3RlZFJvd3MgPSBbXTtcclxuICAgICAgICB9LFxyXG4gICAgICAgICd7aXRlbXN9IGFkZCc6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy52aWV3TW9kZWwuQ3VycmVudFBhZ2UgPSAxO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgJ3tpdGVtc30gcmVtb3ZlJzogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLnZpZXdNb2RlbC5DdXJyZW50UGFnZSA9IDE7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInt2aWV3TW9kZWx9IGl0ZW1zIHNldFwiOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudmlld01vZGVsLkN1cnJlbnRQYWdlID0gMTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pOyJdfQ==
