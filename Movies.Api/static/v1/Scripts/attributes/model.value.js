define(['exports', 'can', 'lodash'], function (exports, _can, _lodash) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _can2 = _interopRequireDefault(_can);

    var _lodash2 = _interopRequireDefault(_lodash);

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
    }

    var Value = _can2.default.Control({
        init: function init() {
            this.setFromModel();
        },
        "{value} change": "setFromModel",
        setFromModel: function setFromModel() {
            _proxy.getInterceptor(this, 'element').val(_proxy.getInterceptor(this, 'options').value());
        },
        setFromControl: function setFromControl() {
            _proxy.getInterceptor(this, 'setFromControlDebounced').cancel();
            _proxy.getInterceptor(this, 'options').value(_proxy.getInterceptor(this, 'element').val());
        },
        setFromControlDebounced: _lodash2.default.debounce(function () {
            this.setFromControl();
        }, 300),
        "keyup": 'setFromControlDebounced',
        "input": 'setFromControl',
        "change": 'setFromControl'
    });

    exports.default = _proxy.getInterceptor(_can2.default, 'view').attr("can-model-value", function (element, attrData) {

        var valuePath = element.getAttribute("can-model-value");
        var valueCompute = _proxy.getInterceptor(attrData, 'scope').compute(valuePath);

        new Value(element, { value: valueCompute });
    });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZGVsLnZhbHVlLmVzNi5qcyJdLCJuYW1lcyI6WyJ3aW5kb3ciLCJfcHJveHkiLCJnZXRJbnRlcmNlcHRvciIsIm9iamVjdCIsInByb3BlcnR5TmFtZSIsImF0dHIiLCJfZGF0YSIsInNldEludGVyY2VwdG9yIiwidmFsdWUiLCJ1cGRhdGVQb3N0Zml4QWRkSW50ZXJjZXB0b3IiLCJvcmlnaW5hbCIsInVwZGF0ZVBvc3RmaXhTdWJ0cmFjdEludGVyY2VwdG9yIiwiVmFsdWUiLCJjYW4iLCJDb250cm9sIiwiaW5pdCIsInNldEZyb21Nb2RlbCIsInZhbCIsInNldEZyb21Db250cm9sIiwiY2FuY2VsIiwic2V0RnJvbUNvbnRyb2xEZWJvdW5jZWQiLCJfIiwiZGVib3VuY2UiLCJlbGVtZW50IiwiYXR0ckRhdGEiLCJ2YWx1ZVBhdGgiLCJnZXRBdHRyaWJ1dGUiLCJ2YWx1ZUNvbXB1dGUiLCJjb21wdXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFDLFFBQUksQ0FBQ0EsT0FBT0MsTUFBWixFQUFvQjtBQUNqQkQsZUFBT0MsTUFBUCxHQUFnQixFQUNaQyxnQkFBZ0Isd0JBQVVDLE1BQVYsRUFBa0JDLFlBQWxCLEVBQWdDO0FBQzVDLG9CQUFJRCxPQUFPRSxJQUFQLElBQWVGLE9BQU9HLEtBQXRCLElBQStCSCxPQUFPRyxLQUFQLENBQWFGLFlBQWIsQ0FBbkMsRUFBK0Q7QUFDM0QsMkJBQU9ELE9BQU9FLElBQVAsQ0FBWUQsWUFBWixDQUFQO0FBQ0gsaUJBQ0QsT0FBT0QsT0FBT0MsWUFBUCxDQUFQO0FBQ0gsYUFOVyxFQU9aRyxnQkFBZ0Isd0JBQVVKLE1BQVYsRUFBa0JDLFlBQWxCLEVBQWdDSSxLQUFoQyxFQUF1QztBQUNuRCxvQkFBSUwsT0FBT0UsSUFBWCxFQUFpQjtBQUNiLDJCQUFPRixPQUFPRSxJQUFQLENBQVlELFlBQVosRUFBMEJJLEtBQTFCLENBQVA7QUFDSCxpQkFGRCxNQUdLO0FBQ0QsMkJBQU9MLE9BQU9DLFlBQVAsSUFBdUJJLEtBQTlCO0FBQ0g7QUFDSixhQWRXLEVBZVpDLDZCQUE2QixxQ0FBVU4sTUFBVixFQUFrQkMsWUFBbEIsRUFBZ0M7QUFDekQsb0JBQUlNLFdBQVcsS0FBS1IsY0FBTCxDQUFvQkMsTUFBcEIsRUFBNEJDLFlBQTVCLENBQWYsQ0FDQSxLQUFLRyxjQUFMLENBQW9CSixNQUFwQixFQUE0QkMsWUFBNUIsRUFBMENNLFdBQVcsQ0FBckQsRUFDQSxPQUFPQSxRQUFQO0FBQ0gsYUFuQlcsRUFvQlpDLGtDQUFrQywwQ0FBVVIsTUFBVixFQUFrQkMsWUFBbEIsRUFBZ0NJLEtBQWhDLEVBQXVDO0FBQ3JFLG9CQUFJRSxXQUFXLEtBQUtSLGNBQUwsQ0FBb0JDLE1BQXBCLEVBQTRCQyxZQUE1QixDQUFmLENBQ0EsS0FBS0csY0FBTCxDQUFvQkosTUFBcEIsRUFBNEJDLFlBQTVCLEVBQTBDSSxRQUFRLENBQWxELEVBQ0EsT0FBT0UsUUFBUDtBQUNILGFBeEJXLEVBQWhCO0FBMEJIOztBQXhCRCxRQUFJRSxRQUFRQyxjQUFJQyxPQUFKLENBQVk7QUFDcEJDLGNBQU0sZ0JBQVk7QUFDZCxpQkFBS0MsWUFBTDtBQUNILFNBSG1CO0FBSXBCLDBCQUFrQixjQUpFO0FBS3BCQSxzQkFBYyx3QkFBWTtBQUN0QixtREFBYUMsR0FBYixDQUFpQix1Q0FBYVQsS0FBYixFQUFqQjtBQUNILFNBUG1CO0FBUXBCVSx3QkFBZ0IsMEJBQVk7QUFDeEIsbUVBQTZCQyxNQUE3QjtBQUNBLG1EQUFhWCxLQUFiLENBQW1CLHVDQUFhUyxHQUFiLEVBQW5CO0FBQ0gsU0FYbUI7QUFZcEJHLGlDQUF5QkMsaUJBQUVDLFFBQUYsQ0FBVyxZQUFZO0FBQzVDLGlCQUFLSixjQUFMO0FBQ0gsU0FGd0IsRUFFdEIsR0FGc0IsQ0FaTDtBQWVwQixpQkFBUyx5QkFmVztBQWdCcEIsaUJBQVMsZ0JBaEJXO0FBaUJwQixrQkFBVTtBQWpCVSxLQUFaLENBQVo7O3NCQW9CZSw2Q0FBU2IsSUFBVCxDQUFjLGlCQUFkLEVBQWlDLFVBQVVrQixPQUFWLEVBQW1CQyxRQUFuQixFQUE2Qjs7QUFFekUsWUFBSUMsWUFBWUYsUUFBUUcsWUFBUixDQUFxQixpQkFBckIsQ0FBaEI7QUFDQSxZQUFJQyxlQUFlLHlDQUFlQyxPQUFmLENBQXVCSCxTQUF2QixDQUFuQjs7QUFFQSxZQUFJYixLQUFKLENBQVVXLE9BQVYsRUFBbUIsRUFBRWYsT0FBT21CLFlBQVQsRUFBbkI7QUFDSCxLQU5jLEMiLCJmaWxlIjoibW9kZWwudmFsdWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyLvu79pbXBvcnQgY2FuIGZyb20gJ2Nhbic7XHJcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcblxyXG52YXIgVmFsdWUgPSBjYW4uQ29udHJvbCh7XHJcbiAgICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5zZXRGcm9tTW9kZWwoKTtcclxuICAgIH0sXHJcbiAgICBcInt2YWx1ZX0gY2hhbmdlXCI6IFwic2V0RnJvbU1vZGVsXCIsXHJcbiAgICBzZXRGcm9tTW9kZWw6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmVsZW1lbnQudmFsKHRoaXMub3B0aW9ucy52YWx1ZSgpKTtcclxuICAgIH0sXHJcbiAgICBzZXRGcm9tQ29udHJvbDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuc2V0RnJvbUNvbnRyb2xEZWJvdW5jZWQuY2FuY2VsKCk7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLnZhbHVlKHRoaXMuZWxlbWVudC52YWwoKSk7XHJcbiAgICB9LFxyXG4gICAgc2V0RnJvbUNvbnRyb2xEZWJvdW5jZWQ6IF8uZGVib3VuY2UoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuc2V0RnJvbUNvbnRyb2woKTtcclxuICAgIH0sIDMwMCksXHJcbiAgICBcImtleXVwXCI6ICdzZXRGcm9tQ29udHJvbERlYm91bmNlZCcsXHJcbiAgICBcImlucHV0XCI6ICdzZXRGcm9tQ29udHJvbCcsXHJcbiAgICBcImNoYW5nZVwiOiAnc2V0RnJvbUNvbnRyb2wnXHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2FuLnZpZXcuYXR0cihcImNhbi1tb2RlbC12YWx1ZVwiLCBmdW5jdGlvbiAoZWxlbWVudCwgYXR0ckRhdGEpIHtcclxuXHJcbiAgICB2YXIgdmFsdWVQYXRoID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJjYW4tbW9kZWwtdmFsdWVcIik7XHJcbiAgICB2YXIgdmFsdWVDb21wdXRlID0gYXR0ckRhdGEuc2NvcGUuY29tcHV0ZSh2YWx1ZVBhdGgpO1xyXG5cclxuICAgIG5ldyBWYWx1ZShlbGVtZW50LCB7IHZhbHVlOiB2YWx1ZUNvbXB1dGUgfSk7XHJcbn0pOyJdfQ==
