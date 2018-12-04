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
                    }
                },
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhZ2UuY291bnQuZXM2LmpzIl0sIm5hbWVzIjpbIndpbmRvdyIsIl9wcm94eSIsImdldEludGVyY2VwdG9yIiwib2JqZWN0IiwicHJvcGVydHlOYW1lIiwiYXR0ciIsIl9kYXRhIiwic2V0SW50ZXJjZXB0b3IiLCJ2YWx1ZSIsInVwZGF0ZVBvc3RmaXhBZGRJbnRlcmNlcHRvciIsIm9yaWdpbmFsIiwidXBkYXRlUG9zdGZpeFN1YnRyYWN0SW50ZXJjZXB0b3IiLCJleHRlbmQiLCJ0YWciLCJ2aWV3TW9kZWwiLCJkZWZpbmUiLCJjdXJyZW50UGFnZSIsInR5cGUiLCJzZXQiLCJ1bmRlZmluZWQiLCJwYWdlQ291bnQiLCJtYXhwYWdlcyIsImV2ZW50cyIsImluc2VydGVkIiwic3luY1BhZ2VyIiwib3B0aW9ucyIsInRvdGFsIiwicGFnZSIsIm1heFZpc2libGUiLCJib290cGFnIiwiX2VsIiwiX2V2IiwiZGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFDLFFBQUksQ0FBQ0EsT0FBT0MsTUFBWixFQUFvQjtBQUNqQkQsZUFBT0MsTUFBUCxHQUFnQjtBQUNaQyw0QkFBZ0Isd0JBQVVDLE1BQVYsRUFBa0JDLFlBQWxCLEVBQWdDO0FBQzVDLG9CQUFJRCxPQUFPRSxJQUFQLElBQWVGLE9BQU9HLEtBQXRCLElBQStCSCxPQUFPRyxLQUFQLENBQWFGLFlBQWIsQ0FBbkMsRUFBK0Q7QUFDM0QsMkJBQU9ELE9BQU9FLElBQVAsQ0FBWUQsWUFBWixDQUFQO0FBQ0gsaUJBQ0QsT0FBT0QsT0FBT0MsWUFBUCxDQUFQO0FBQ0gsYUFOVyxFQU9aRyxnQkFBZ0Isd0JBQVVKLE1BQVYsRUFBa0JDLFlBQWxCLEVBQWdDSSxLQUFoQyxFQUF1QztBQUNuRCxvQkFBSUwsT0FBT0UsSUFBWCxFQUFpQjtBQUNiLDJCQUFPRixPQUFPRSxJQUFQLENBQVlELFlBQVosRUFBMEJJLEtBQTFCLENBQVA7QUFDSCxpQkFGRCxNQUdLO0FBQ0QsMkJBQU9MLE9BQU9DLFlBQVAsSUFBdUJJLEtBQTlCO0FBQ0g7QUFDSixhQWRXLEVBZVpDLDZCQUE2QixxQ0FBVU4sTUFBVixFQUFrQkMsWUFBbEIsRUFBZ0M7QUFDekQsb0JBQUlNLFdBQVcsS0FBS1IsY0FBTCxDQUFvQkMsTUFBcEIsRUFBNEJDLFlBQTVCLENBQWYsQ0FDQSxLQUFLRyxjQUFMLENBQW9CSixNQUFwQixFQUE0QkMsWUFBNUIsRUFBMENNLFdBQVcsQ0FBckQsRUFDQSxPQUFPQSxRQUFQO0FBQ0gsYUFuQlcsRUFvQlpDLGtDQUFrQywwQ0FBVVIsTUFBVixFQUFrQkMsWUFBbEIsRUFBZ0NJLEtBQWhDLEVBQXVDO0FBQ3JFLG9CQUFJRSxXQUFXLEtBQUtSLGNBQUwsQ0FBb0JDLE1BQXBCLEVBQTRCQyxZQUE1QixDQUFmLENBQ0EsS0FBS0csY0FBTCxDQUFvQkosTUFBcEIsRUFBNEJDLFlBQTVCLEVBQTBDSSxRQUFRLENBQWxELEVBQ0EsT0FBT0UsUUFBUDtBQUNILGFBeEJXLEVBQWhCO0FBMEJILEssa0JBdkJjLGtEQUFjRSxNQUFkLENBQXFCO0FBQ2hDQyxhQUFLLFlBRDJCO0FBRWhDQyxtQkFBVyw0Q0FBUUYsTUFBUixDQUFlO0FBQ3RCRyxvQkFBUTtBQUNKQyw2QkFBYTtBQUNUQywwQkFBTSxRQURHO0FBRVRDLHlCQUFLLGFBQVVWLEtBQVYsRUFBaUI7QUFDbEIsNEJBQUlBLFVBQVVXLFNBQVYsSUFBdUJYLFVBQVUsSUFBakMsSUFBeUNBLFFBQVEsQ0FBckQsRUFBd0Q7QUFDcEQsbUNBQU8sQ0FBUDtBQUNILHlCQUZELE1BR0s7QUFDRCxtQ0FBT0EsS0FBUDtBQUNIO0FBQ0o7QUFUUSxpQkFEVDtBQVlKWSwyQkFBVztBQUNQSCwwQkFBTSxRQURDO0FBRVBDLHlCQUFLLGFBQVVWLEtBQVYsRUFBaUI7QUFDbEIsNEJBQUlBLFVBQVVXLFNBQVYsSUFBdUJYLFVBQVUsSUFBakMsSUFBeUNBLFFBQVEsQ0FBckQsRUFBd0Q7QUFDcEQsbUNBQU8sQ0FBUDtBQUNILHlCQUZELE1BR0s7QUFDRCxtQ0FBT0EsS0FBUDtBQUNIO0FBQ0o7QUFUTSxpQkFaUDtBQXVCSmEsMEJBQVU7QUFDTkosMEJBQU0sUUFEQTtBQUVOQyx5QkFBSyxhQUFVVixLQUFWLEVBQWlCO0FBQ2xCLDRCQUFJQSxVQUFVVyxTQUFWLElBQXVCWCxVQUFVLElBQWpDLElBQXlDQSxRQUFRLENBQXJELEVBQXdEO0FBQ3BELG1DQUFPLENBQVA7QUFDSCx5QkFGRCxNQUdLO0FBQ0QsbUNBQU9BLEtBQVA7QUFDSDtBQUNKO0FBVEs7QUF2Qk47QUFEYyxTQUFmLENBRnFCO0FBdUNoQ2MsZ0JBQVE7QUFDSkMsc0JBQVUsV0FETjtBQUVKLG9DQUF3QixXQUZwQjtBQUdKLGtDQUFzQixXQUhsQjtBQUlKLGlDQUFxQixXQUpqQjtBQUtKLDJDQUErQixXQUwzQjtBQU1KLHlDQUE2QixXQU56QjtBQU9KLHdDQUE0QixXQVB4QjtBQVFKQyx1QkFBVyxxQkFBWTtBQUNuQixvQkFBSUMsVUFBVTtBQUNWQyx1RUFBTyxJQUFQLDRCQURVO0FBRVZDLHNFQUFNLElBQU4sOEJBRlU7QUFHVkMsNEVBQVksSUFBWjtBQUhVLGlCQUFkO0FBS0EsNERBQUUsSUFBRixjQUFnQkMsT0FBaEIsQ0FBd0JKLE9BQXhCO0FBQ0gsYUFmRztBQWdCSiw4QkFBa0IscUJBQVVLLEdBQVYsRUFBZUMsR0FBZixFQUFvQkMsSUFBcEIsRUFBMEI7QUFDeEMsK0ZBQTZCQSxJQUE3QjtBQUNIO0FBbEJHO0FBdkN3QixLQUFyQixDIiwiZmlsZSI6InBhZ2UuY291bnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyLvu79pbXBvcnQgY2FuIGZyb20gJ2Nhbi5mdWxsJztcclxuaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcclxuaW1wb3J0IGJvb3RwYWcgZnJvbSAnYm9vdHBhZyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjYW4uQ29tcG9uZW50LmV4dGVuZCh7XHJcbiAgICB0YWc6IFwicGFnZS1jb3VudFwiLFxyXG4gICAgdmlld01vZGVsOiBjYW4uTWFwLmV4dGVuZCh7XHJcbiAgICAgICAgZGVmaW5lOiB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRQYWdlOiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnbnVtYmVyJyxcclxuICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPCAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcGFnZUNvdW50OiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnbnVtYmVyJyxcclxuICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPCAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbWF4cGFnZXM6IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdudW1iZXInLFxyXG4gICAgICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA8IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSksXHJcbiAgICBldmVudHM6IHtcclxuICAgICAgICBpbnNlcnRlZDogJ3N5bmNQYWdlcicsXHJcbiAgICAgICAgJ3tjdXJyZW50UGFnZX0gY2hhbmdlJzogJ3N5bmNQYWdlcicsXHJcbiAgICAgICAgJ3twYWdlQ291bnR9IGNoYW5nZSc6ICdzeW5jUGFnZXInLFxyXG4gICAgICAgICd7bWF4cGFnZXN9IGNoYW5nZSc6ICdzeW5jUGFnZXInLFxyXG4gICAgICAgICd7dmlld01vZGVsfSBjdXJyZW50UGFnZSBzZXQnOiAnc3luY1BhZ2VyJyxcclxuICAgICAgICAne3ZpZXdNb2RlbH0gcGFnZUNvdW50IHNldCc6ICdzeW5jUGFnZXInLFxyXG4gICAgICAgICd7dmlld01vZGVsfSBtYXhwYWdlcyBzZXQnOiAnc3luY1BhZ2VyJyxcclxuICAgICAgICBzeW5jUGFnZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgbGV0IG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICB0b3RhbDogdGhpcy52aWV3TW9kZWwucGFnZUNvdW50LFxyXG4gICAgICAgICAgICAgICAgcGFnZTogdGhpcy52aWV3TW9kZWwuY3VycmVudFBhZ2UsXHJcbiAgICAgICAgICAgICAgICBtYXhWaXNpYmxlOiB0aGlzLnZpZXdNb2RlbC5tYXhwYWdlc1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAkKHRoaXMuZWxlbWVudCkuYm9vdHBhZyhvcHRpb25zKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgICd7ZWxlbWVudH0gcGFnZSc6IGZ1bmN0aW9uIChfZWwsIF9ldiwgZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLnZpZXdNb2RlbC5jdXJyZW50UGFnZSA9IGRhdGE7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSJdfQ==
