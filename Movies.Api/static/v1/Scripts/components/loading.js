define(['exports', 'can.full', 'stache!components/loading.stache'], function (exports, _can, _loading) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _can2 = _interopRequireDefault(_can);

    var _loading2 = _interopRequireDefault(_loading);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    if (!window._proxy) {
        window._proxy = { getInterceptor: function getInterceptor(object, propertyName) {
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
        tag: "loading",
        template: _loading2.default
    });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxvYWRpbmcuZXM2LmpzIl0sIm5hbWVzIjpbIndpbmRvdyIsIl9wcm94eSIsImdldEludGVyY2VwdG9yIiwib2JqZWN0IiwicHJvcGVydHlOYW1lIiwiYXR0ciIsIl9kYXRhIiwic2V0SW50ZXJjZXB0b3IiLCJ2YWx1ZSIsInVwZGF0ZVBvc3RmaXhBZGRJbnRlcmNlcHRvciIsIm9yaWdpbmFsIiwidXBkYXRlUG9zdGZpeFN1YnRyYWN0SW50ZXJjZXB0b3IiLCJleHRlbmQiLCJ0YWciLCJ0ZW1wbGF0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQyxRQUFJLENBQUNBLE9BQU9DLE1BQVosRUFBb0I7QUFDakJELGVBQU9DLE1BQVAsR0FBZ0IsRUFDWkMsZ0JBQWdCLHdCQUFVQyxNQUFWLEVBQWtCQyxZQUFsQixFQUFnQztBQUM1QyxvQkFBSUQsT0FBT0UsSUFBUCxJQUFlRixPQUFPRyxLQUF0QixJQUErQkgsT0FBT0csS0FBUCxDQUFhRixZQUFiLENBQW5DLEVBQStEO0FBQzNELDJCQUFPRCxPQUFPRSxJQUFQLENBQVlELFlBQVosQ0FBUDtBQUNILGlCQUNELE9BQU9ELE9BQU9DLFlBQVAsQ0FBUDtBQUNILGFBTlcsRUFPWkcsZ0JBQWdCLHdCQUFVSixNQUFWLEVBQWtCQyxZQUFsQixFQUFnQ0ksS0FBaEMsRUFBdUM7QUFDbkQsb0JBQUlMLE9BQU9FLElBQVgsRUFBaUI7QUFDYiwyQkFBT0YsT0FBT0UsSUFBUCxDQUFZRCxZQUFaLEVBQTBCSSxLQUExQixDQUFQO0FBQ0gsaUJBRkQsTUFHSztBQUNELDJCQUFPTCxPQUFPQyxZQUFQLElBQXVCSSxLQUE5QjtBQUNIO0FBQ0osYUFkVyxFQWVaQyw2QkFBNkIscUNBQVVOLE1BQVYsRUFBa0JDLFlBQWxCLEVBQWdDO0FBQ3pELG9CQUFJTSxXQUFXLEtBQUtSLGNBQUwsQ0FBb0JDLE1BQXBCLEVBQTRCQyxZQUE1QixDQUFmLENBQ0EsS0FBS0csY0FBTCxDQUFvQkosTUFBcEIsRUFBNEJDLFlBQTVCLEVBQTBDTSxXQUFXLENBQXJELEVBQ0EsT0FBT0EsUUFBUDtBQUNILGFBbkJXLEVBb0JaQyxrQ0FBa0MsMENBQVVSLE1BQVYsRUFBa0JDLFlBQWxCLEVBQWdDSSxLQUFoQyxFQUF1QztBQUNyRSxvQkFBSUUsV0FBVyxLQUFLUixjQUFMLENBQW9CQyxNQUFwQixFQUE0QkMsWUFBNUIsQ0FBZixDQUNBLEtBQUtHLGNBQUwsQ0FBb0JKLE1BQXBCLEVBQTRCQyxZQUE1QixFQUEwQ0ksUUFBUSxDQUFsRCxFQUNBLE9BQU9FLFFBQVA7QUFDSCxhQXhCVyxFQUFoQjtBQTBCSCxLLGtCQXhCYyxrREFBY0UsTUFBZCxDQUFxQjtBQUNoQ0MsYUFBSyxTQUQyQjtBQUVoQ0Msa0JBQVVBO0FBRnNCLEtBQXJCLEMiLCJmaWxlIjoibG9hZGluZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIu+7v2ltcG9ydCBjYW4gZnJvbSAnY2FuLmZ1bGwnO1xyXG5pbXBvcnQgdGVtcGxhdGUgZnJvbSAnc3RhY2hlIWNvbXBvbmVudHMvbG9hZGluZy5zdGFjaGUnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2FuLkNvbXBvbmVudC5leHRlbmQoe1xyXG4gICAgdGFnOiBcImxvYWRpbmdcIixcclxuICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZVxyXG59KTsiXX0=
