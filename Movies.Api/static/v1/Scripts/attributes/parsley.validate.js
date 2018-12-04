define(['exports', 'can.full', 'jquery', 'parsley', 'Enumerable'], function (exports, _can, _jquery, _parsley, _Enumerable) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _can2 = _interopRequireDefault(_can);

    var _jquery2 = _interopRequireDefault(_jquery);

    var _parsley2 = _interopRequireDefault(_parsley);

    var _Enumerable2 = _interopRequireDefault(_Enumerable);

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
    }

    var validationControlCtor = _can2.default.Control({
        init: function init(element, options) {
            if (element.is('form')) {
                element.parsley();
            }
        },
        '{isEnabled} change': function isEnabledChange() {
            var _this = this;

            _proxy.getInterceptor(this, 'element').find(':input').each(function (_i, v) {
                if (_proxy.getInterceptor(_this, 'options').isEnabled()) {
                    v.parsley().destroy();
                } else {
                    v.parsley();
                }
            });
        },
        validateOnSubmit: function validateOnSubmit() {
            if (!_proxy.getInterceptor(this, 'options').enabledOnSubmit()) {
                if (_proxy.getInterceptor(this, 'options').isEnabled()) {
                    _proxy.getInterceptor(this, 'element').find(':input').each(function (_i, v) {
                        v.parsley().destroy();
                    });
                    _proxy.getInterceptor(this, 'options').isEnabled(false);
                }
            } else {
                if (!_proxy.getInterceptor(this, 'options').isEnabled()) {
                    _proxy.getInterceptor(this, 'element').find(':input').each(function (_i, v) {
                        v.parsley();
                    });
                    _proxy.getInterceptor(this, 'options').isEnabled(true);
                }
            }
        },
        '{window} {submitButtonSelector} click': "validateOnSubmit",
        'submit': "validateOnSubmit",
        '.js-validate-section click': function jsValidateSectionClick() {
            //make sure the inputs have their validations set to true
            if (!_proxy.getInterceptor(this, 'options').isEnabled()) {
                _proxy.getInterceptor(this, 'options').isEnabled(true);
            }
            var valid = true;
            _proxy.getInterceptor(this, 'element').find(':input').not(':disabled').each(function (_i, v) {
                valid = v.parsley().isValid() && valid; //TODO_CHECK PARSLEY
            });

            _proxy.getInterceptor(this, 'options').valid(valid);

            _proxy.getInterceptor(this, 'element').trigger('parsley.validate', [_proxy.getInterceptor(this, 'options').valid()]);

            if (valid) {
                _proxy.getInterceptor(this, 'element').trigger('parsley.valid', []);
            } else {
                _proxy.getInterceptor(this, 'element').trigger('parsley.invalid', []);
            }
        },
        '.js-reset-section click': function jsResetSectionClick() {
            _proxy.getInterceptor(this, 'element').find(':input').each(function (_i, v) {
                v.parsley().reset();
            });
            _proxy.getInterceptor(this, 'viewModel').valid(true);
            _proxy.getInterceptor(this, 'element').trigger('parsley.reset', []);
        }
    });

    exports.default = _proxy.getInterceptor(_can2.default, 'view').attr("parsley-validate", function (element, attrData) {

        var data = (0, _jquery2.default)(element).data();

        var isEnabledPath = element.getAttribute("parsley-is-enabled");
        var isEnabledCompute = isEnabledPath ? _proxy.getInterceptor(attrData, 'scope').compute(isEnabledPath) : _can2.default.compute(_proxy.getInterceptor(data, 'isEnabled') || true);

        var validPath = element.getAttribute("parsley-valid");
        var validCompute = validPath ? _proxy.getInterceptor(attrData, 'scope').compute(isEnabledPath) : _can2.default.compute();

        var enabledOnSubmitPath = element.getAttribute("parsley-enabled-on-submit");
        var enabledOnSubmitCompute = enabledOnSubmitPath ? _proxy.getInterceptor(attrData, 'scope').compute(enabledOnSubmitPath) : _can2.default.compute(_proxy.getInterceptor(data, 'enabledOnSubmit') || true);

        var submitButtonSelector = _proxy.getInterceptor(data, 'parsleySubmitButtonSelector');

        new validationControlCtor(element, { isEnabled: isEnabledCompute, valid: validCompute, enabledOnSubmit: enabledOnSubmitCompute, submitButtonSelector: submitButtonSelector });
    });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhcnNsZXkudmFsaWRhdGUuZXM2LmpzIl0sIm5hbWVzIjpbIndpbmRvdyIsIl9wcm94eSIsImdldEludGVyY2VwdG9yIiwib2JqZWN0IiwicHJvcGVydHlOYW1lIiwiYXR0ciIsIl9kYXRhIiwic2V0SW50ZXJjZXB0b3IiLCJ2YWx1ZSIsInVwZGF0ZVBvc3RmaXhBZGRJbnRlcmNlcHRvciIsIm9yaWdpbmFsIiwidXBkYXRlUG9zdGZpeFN1YnRyYWN0SW50ZXJjZXB0b3IiLCJ2YWxpZGF0aW9uQ29udHJvbEN0b3IiLCJjYW4iLCJDb250cm9sIiwiaW5pdCIsImVsZW1lbnQiLCJvcHRpb25zIiwiaXMiLCJwYXJzbGV5IiwiZmluZCIsImVhY2giLCJfaSIsInYiLCJpc0VuYWJsZWQiLCJkZXN0cm95IiwidmFsaWRhdGVPblN1Ym1pdCIsImVuYWJsZWRPblN1Ym1pdCIsInZhbGlkIiwibm90IiwiaXNWYWxpZCIsInRyaWdnZXIiLCJyZXNldCIsImF0dHJEYXRhIiwiZGF0YSIsImlzRW5hYmxlZFBhdGgiLCJnZXRBdHRyaWJ1dGUiLCJpc0VuYWJsZWRDb21wdXRlIiwiY29tcHV0ZSIsInZhbGlkUGF0aCIsInZhbGlkQ29tcHV0ZSIsImVuYWJsZWRPblN1Ym1pdFBhdGgiLCJlbmFibGVkT25TdWJtaXRDb21wdXRlIiwic3VibWl0QnV0dG9uU2VsZWN0b3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFDLFFBQUksQ0FBQ0EsT0FBT0MsTUFBWixFQUFvQjtBQUNqQkQsZUFBT0MsTUFBUCxHQUFnQjtBQUNaQyw0QkFBZ0Isd0JBQVVDLE1BQVYsRUFBa0JDLFlBQWxCLEVBQWdDO0FBQzVDLG9CQUFJRCxPQUFPRSxJQUFQLElBQWVGLE9BQU9HLEtBQXRCLElBQStCSCxPQUFPRyxLQUFQLENBQWFGLFlBQWIsQ0FBbkMsRUFBK0Q7QUFDM0QsMkJBQU9ELE9BQU9FLElBQVAsQ0FBWUQsWUFBWixDQUFQO0FBQ0gsaUJBQ0QsT0FBT0QsT0FBT0MsWUFB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QVIsQ0FBcUIsMkJBQXJCLENBQTFCO0FBQ0EsWUFBSU0seUJBQXlCRCxzQkFBc0IseUNBQWVILE9BQWYsQ0FBdUJHLG1CQUF2QixDQUF0QixHQUFvRTVCLGNBQUl5QixPQUFKLENBQVksa0RBQXdCLElBQXBDLENBQWpHOztBQUVBLFlBQUlLLDZDQUF1QlQsSUFBdkIsZ0NBQUo7O0FBRUEsWUFBSXRCLHFCQUFKLENBQTBCSSxPQUExQixFQUFtQyxFQUFFUSxXQUFXYSxnQkFBYixFQUErQlQsT0FBT1ksWUFBdEMsRUFBb0RiLGlCQUFpQmUsc0JBQXJFLEVBQTZGQyxzQkFBc0JBLG9CQUFuSCxFQUFuQztBQUNILEtBaEJjLEMiLCJmaWxlIjoicGFyc2xleS52YWxpZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIu+7v2ltcG9ydCBjYW4gZnJvbSAnY2FuLmZ1bGwnO1xyXG5pbXBvcnQgJCBmcm9tICdqcXVlcnknO1xyXG5pbXBvcnQgcGFyc2xleSBmcm9tICdwYXJzbGV5JztcclxuaW1wb3J0IEVudW1lcmFibGUgZnJvbSBcIkVudW1lcmFibGVcIjtcclxuXHJcbnZhciB2YWxpZGF0aW9uQ29udHJvbEN0b3IgPSBjYW4uQ29udHJvbCh7XHJcbiAgICBpbml0OiBmdW5jdGlvbiAoZWxlbWVudCwgb3B0aW9ucykge1xyXG4gICAgICAgIGlmIChlbGVtZW50LmlzKCdmb3JtJykpIHtcclxuICAgICAgICAgICAgZWxlbWVudC5wYXJzbGV5KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgICd7aXNFbmFibGVkfSBjaGFuZ2UnOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJzppbnB1dCcpLmVhY2goKF9pLCB2KSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuaXNFbmFibGVkKCkpIHtcclxuICAgICAgICAgICAgICAgIHYucGFyc2xleSgpLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHYucGFyc2xleSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgdmFsaWRhdGVPblN1Ym1pdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5vcHRpb25zLmVuYWJsZWRPblN1Ym1pdCgpKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuaXNFbmFibGVkKCkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCc6aW5wdXQnKS5lYWNoKChfaSwgdikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHYucGFyc2xleSgpLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLmlzRW5hYmxlZChmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5vcHRpb25zLmlzRW5hYmxlZCgpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuZmluZCgnOmlucHV0JykuZWFjaCgoX2ksIHYpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB2LnBhcnNsZXkoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLmlzRW5hYmxlZCh0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICAne3dpbmRvd30ge3N1Ym1pdEJ1dHRvblNlbGVjdG9yfSBjbGljayc6IFwidmFsaWRhdGVPblN1Ym1pdFwiLFxyXG4gICAgJ3N1Ym1pdCc6IFwidmFsaWRhdGVPblN1Ym1pdFwiLFxyXG4gICAgJy5qcy12YWxpZGF0ZS1zZWN0aW9uIGNsaWNrJzogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8vbWFrZSBzdXJlIHRoZSBpbnB1dHMgaGF2ZSB0aGVpciB2YWxpZGF0aW9ucyBzZXQgdG8gdHJ1ZVxyXG4gICAgICAgIGlmICghdGhpcy5vcHRpb25zLmlzRW5hYmxlZCgpKSB7XHJcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5pc0VuYWJsZWQodHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCB2YWxpZCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJzppbnB1dCcpLm5vdCgnOmRpc2FibGVkJykuZWFjaCgoX2ksIHYpID0+IHtcclxuICAgICAgICAgICAgdmFsaWQgPSB2LnBhcnNsZXkoKS5pc1ZhbGlkKCkgJiYgdmFsaWQ7Ly9UT0RPX0NIRUNLIFBBUlNMRVlcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5vcHRpb25zLnZhbGlkKHZhbGlkKTtcclxuXHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnRyaWdnZXIoJ3BhcnNsZXkudmFsaWRhdGUnLCBbdGhpcy5vcHRpb25zLnZhbGlkKCldKTtcclxuXHJcbiAgICAgICAgaWYgKHZhbGlkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC50cmlnZ2VyKCdwYXJzbGV5LnZhbGlkJywgW10pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnRyaWdnZXIoJ3BhcnNsZXkuaW52YWxpZCcsIFtdKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgJy5qcy1yZXNldC1zZWN0aW9uIGNsaWNrJzogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCc6aW5wdXQnKS5lYWNoKChfaSwgdikgPT4ge1xyXG4gICAgICAgICAgICB2LnBhcnNsZXkoKS5yZXNldCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMudmlld01vZGVsLnZhbGlkKHRydWUpO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC50cmlnZ2VyKCdwYXJzbGV5LnJlc2V0JywgW10pO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNhbi52aWV3LmF0dHIoXCJwYXJzbGV5LXZhbGlkYXRlXCIsIGZ1bmN0aW9uIChlbGVtZW50LCBhdHRyRGF0YSkge1xyXG5cclxuICAgIGxldCBkYXRhID0gJChlbGVtZW50KS5kYXRhKCk7XHJcblxyXG4gICAgbGV0IGlzRW5hYmxlZFBhdGggPSBlbGVtZW50LmdldEF0dHJpYnV0ZShcInBhcnNsZXktaXMtZW5hYmxlZFwiKTtcclxuICAgIGxldCBpc0VuYWJsZWRDb21wdXRlID0gaXNFbmFibGVkUGF0aCA/IGF0dHJEYXRhLnNjb3BlLmNvbXB1dGUoaXNFbmFibGVkUGF0aCkgOiBjYW4uY29tcHV0ZShkYXRhLmlzRW5hYmxlZCB8fCB0cnVlKTtcclxuXHJcbiAgICBsZXQgdmFsaWRQYXRoID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJwYXJzbGV5LXZhbGlkXCIpO1xyXG4gICAgbGV0IHZhbGlkQ29tcHV0ZSA9IHZhbGlkUGF0aCA/IGF0dHJEYXRhLnNjb3BlLmNvbXB1dGUoaXNFbmFibGVkUGF0aCkgOiBjYW4uY29tcHV0ZSgpO1xyXG5cclxuICAgIGxldCBlbmFibGVkT25TdWJtaXRQYXRoID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJwYXJzbGV5LWVuYWJsZWQtb24tc3VibWl0XCIpO1xyXG4gICAgbGV0IGVuYWJsZWRPblN1Ym1pdENvbXB1dGUgPSBlbmFibGVkT25TdWJtaXRQYXRoID8gYXR0ckRhdGEuc2NvcGUuY29tcHV0ZShlbmFibGVkT25TdWJtaXRQYXRoKSA6IGNhbi5jb21wdXRlKGRhdGEuZW5hYmxlZE9uU3VibWl0IHx8IHRydWUpO1xyXG5cclxuICAgIGxldCBzdWJtaXRCdXR0b25TZWxlY3RvciA9IGRhdGEucGFyc2xleVN1Ym1pdEJ1dHRvblNlbGVjdG9yO1xyXG5cclxuICAgIG5ldyB2YWxpZGF0aW9uQ29udHJvbEN0b3IoZWxlbWVudCwgeyBpc0VuYWJsZWQ6IGlzRW5hYmxlZENvbXB1dGUsIHZhbGlkOiB2YWxpZENvbXB1dGUsIGVuYWJsZWRPblN1Ym1pdDogZW5hYmxlZE9uU3VibWl0Q29tcHV0ZSwgc3VibWl0QnV0dG9uU2VsZWN0b3I6IHN1Ym1pdEJ1dHRvblNlbGVjdG9yIH0pO1xyXG59KTsiXX0=
