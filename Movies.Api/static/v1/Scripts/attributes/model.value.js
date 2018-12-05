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
