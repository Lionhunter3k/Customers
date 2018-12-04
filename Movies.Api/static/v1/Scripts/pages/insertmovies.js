define(['exports', 'jquery', 'can.full', 'stache!pages/insertmovies.stache'], function (exports, _jquery, _can, _insertmovies) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _jquery2 = _interopRequireDefault(_jquery);

    var _can2 = _interopRequireDefault(_can);

    var _insertmovies2 = _interopRequireDefault(_insertmovies);

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
        tag: "insertmovies",
        template: _insertmovies2.default,
        viewModel: _proxy.getInterceptor(_can2.default, 'Map').extend({
            define: {
                title: {
                    type: 'string',
                    value: 'Insert movies'
                }
            } })
    });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluc2VydG1vdmllcy5lczYuanMiXSwibmFtZXMiOlsid2luZG93IiwiX3Byb3h5IiwiZ2V0SW50ZXJjZXB0b3IiLCJvYmplY3QiLCJwcm9wZXJ0eU5hbWUiLCJhdHRyIiwiX2RhdGEiLCJzZXRJbnRlcmNlcHRvciIsInZhbHVlIiwidXBkYXRlUG9zdGZpeEFkZEludGVyY2VwdG9yIiwib3JpZ2luYWwiLCJ1cGRhdGVQb3N0Zml4U3VidHJhY3RJbnRlcmNlcHRvciIsImV4dGVuZCIsInRhZyIsInRlbXBsYXRlIiwidmlld01vZGVsIiwiZGVmaW5lIiwidGl0bGUiLCJ0eXBlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUMsUUFBSSxDQUFDQSxPQUFPQyxNQUFaLEVBQW9CO0FBQ2pCRCxlQUFPQyxNQUFQLEdBQWdCO0FBQ1pDLDRCQUFnQix3QkFBVUMsTUFBVixFQUFrQkMsWUFBbEIsRUFBZ0M7QUFDNUMsb0JBQUlELE9BQU9FLElBQVAsSUFBZUYsT0FBT0csS0FBdEIsSUFBK0JILE9BQU9HLEtBQVAsQ0FBYUYsWUFBYixDQUFuQyxFQUErRDtBQUMzRCwyQkFBT0QsT0FBT0UsSUFBUCxDQUFZRCxZQUFaLENBQVA7QUFDSCxpQkFDRCxPQUFPRCxPQUFPQyxZQUFQLENBQVA7QUFDSCxhQU5XLEVBT1pHLGdCQUFnQix3QkFBVUosTUFBVixFQUFrQkMsWUFBbEIsRUFBZ0NJLEtBQWhDLEVBQXVDO0FBQ25ELG9CQUFJTCxPQUFPRSxJQUFYLEVBQWlCO0FBQ2IsMkJBQU9GLE9BQU9FLElBQVAsQ0FBWUQsWUFBWixFQUEwQkksS0FBMUIsQ0FBUDtBQUNILGlCQUZELE1BR0s7QUFDRCwyQkFBT0wsT0FBT0MsWUFBUCxJQUF1QkksS0FBOUI7QUFDSDtBQUNKLGFBZFcsRUFlWkMsNkJBQTZCLHFDQUFVTixNQUFWLEVBQWtCQyxZQUFsQixFQUFnQztBQUN6RCxvQkFBSU0sV0FBVyxLQUFLUixjQUFMLENBQW9CQyxNQUFwQixFQUE0QkMsWUFBNUIsQ0FBZixDQUNBLEtBQUtHLGNBQUwsQ0FBb0JKLE1BQXBCLEVBQTRCQyxZQUE1QixFQUEwQ00sV0FBVyxDQUFyRCxFQUNBLE9BQU9BLFFBQVA7QUFDSCxhQW5CVyxFQW9CWkMsa0NBQWtDLDBDQUFVUixNQUFWLEVBQWtCQyxZQUFsQixFQUFnQ0ksS0FBaEMsRUFBdUM7QUFDckUsb0JBQUlFLFdBQVcsS0FBS1IsY0FBTCxDQUFvQkMsTUFBcEIsRUFBNEJDLFlBQTVCLENBQWYsQ0FDQSxLQUFLRyxjQUFMLENBQW9CSixNQUFwQixFQUE0QkMsWUFBNUIsRUFBMENJLFFBQVEsQ0FBbEQsRUFDQSxPQUFPRSxRQUFQO0FBQ0gsYUF4QlcsRUFBaEI7QUEwQkgsSyxrQkF2QmMsa0RBQWNFLE1BQWQsQ0FBcUI7QUFDaENDLGFBQUssY0FEMkI7QUFFaENDLGtCQUFVQSxzQkFGc0I7QUFHaENDLG1CQUFXLDRDQUFRSCxNQUFSLENBQWU7QUFDdEJJLG9CQUFRO0FBQ0pDLHVCQUFPO0FBQ0hDLDBCQUFNLFFBREg7QUFFSFYsMkJBQU87QUFGSjtBQURILGFBRGMsRUFBZjtBQUhxQixLQUFyQixDIiwiZmlsZSI6Imluc2VydG1vdmllcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIu+7v2ltcG9ydCAkIGZyb20gJ2pxdWVyeSc7XHJcbmltcG9ydCBjYW4gZnJvbSAnY2FuLmZ1bGwnO1xyXG5pbXBvcnQgdGVtcGxhdGUgZnJvbSAnc3RhY2hlIXBhZ2VzL2luc2VydG1vdmllcy5zdGFjaGUnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2FuLkNvbXBvbmVudC5leHRlbmQoe1xyXG4gICAgdGFnOiBcImluc2VydG1vdmllc1wiLFxyXG4gICAgdGVtcGxhdGU6IHRlbXBsYXRlLFxyXG4gICAgdmlld01vZGVsOiBjYW4uTWFwLmV4dGVuZCh7XHJcbiAgICAgICAgZGVmaW5lOiB7XHJcbiAgICAgICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiAnSW5zZXJ0IG1vdmllcydcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn0pOyJdfQ==
