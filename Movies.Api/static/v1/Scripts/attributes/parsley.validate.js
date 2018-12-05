define(['exports', 'can.full', 'jquery', 'parsley', 'enumerable'], function (exports, _can, _jquery, _parsley, _enumerable) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _can2 = _interopRequireDefault(_can);

    var _jquery2 = _interopRequireDefault(_jquery);

    var _parsley2 = _interopRequireDefault(_parsley);

    var _enumerable2 = _interopRequireDefault(_enumerable);

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
                }
                return object[propertyName];
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

    var bootstrapOptions = {
        successClass: "has-success",
        errorClass: "has-error",
        classHandler: function classHandler(e) {
            return _proxy.getInterceptor(e, '$element').closest('.form-group');
        },
        errorsWrapper: "<span class='help-block'></span>", errorTemplate: "<span></span>"
    };

    var validationControlCtor = _can2.default.Control({
        init: function init(element, options) {
            if (element.is('form')) {
                element.parsley(bootstrapOptions);
            }
        },
        '{isEnabled} change': function isEnabledChange() {
            var _this = this;

            _proxy.getInterceptor(this, 'element').find(':input').each(function (_i, v) {
                if (_proxy.getInterceptor(_this, 'options').isEnabled()) {
                    (0, _jquery2.default)(v).parsley().destroy();
                } else {
                    (0, _jquery2.default)(v).parsley(bootstrapOptions);
                }
            });
        },
        validateOnSubmit: function validateOnSubmit() {
            if (!_proxy.getInterceptor(this, 'options').enabledOnSubmit()) {
                if (_proxy.getInterceptor(this, 'options').isEnabled()) {
                    _proxy.getInterceptor(this, 'element').find(':input').each(function (_i, v) {
                        (0, _jquery2.default)(v).parsley().destroy();
                    });
                    _proxy.getInterceptor(this, 'options').isEnabled(false);
                }
            } else {
                if (!_proxy.getInterceptor(this, 'options').isEnabled()) {
                    _proxy.getInterceptor(this, 'options').isEnabled(true);
                }
                this.validateElements();
            }
        },
        validateElements: function validateElements() {
            var valid = true;
            _proxy.getInterceptor(this, 'element').find(':input').not(':disabled').each(function (_i, v) {
                valid = (0, _jquery2.default)(v).parsley().isValid() && valid; //TODO_CHECK PARSLEY
            });

            _proxy.getInterceptor(this, 'options').valid(valid);

            _proxy.getInterceptor(this, 'element').trigger('parsley.validate', [_proxy.getInterceptor(this, 'options').valid()]);

            if (valid) {
                _proxy.getInterceptor(this, 'element').trigger('parsley.valid', []);
            } else {
                _proxy.getInterceptor(this, 'element').trigger('parsley.invalid', []);
            }
        },
        '{window} {submitButtonSelector} click': "validateOnSubmit",
        'submit': "validateOnSubmit",
        '.js-validate-section click': function jsValidateSectionClick() {
            //make sure the inputs have their validations set to true
            if (!_proxy.getInterceptor(this, 'options').isEnabled()) {
                _proxy.getInterceptor(this, 'options').isEnabled(true);
            }
            this.validateElements();
        },
        'reset': 'resetSection',
        '.js-reset-section click': 'resetSection',
        resetSection: function resetSection() {
            _proxy.getInterceptor(this, 'element').find(':input').each(function (_i, v) {
                (0, _jquery2.default)(v).parsley().reset();
            });
            _proxy.getInterceptor(this, 'options').valid(true);
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
