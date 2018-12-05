define(['exports', 'can.full', 'underscore', 'jquery'], function (exports, _can, _underscore, _jquery) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _can2 = _interopRequireDefault(_can);

	var _underscore2 = _interopRequireDefault(_underscore);

	var _jquery2 = _interopRequireDefault(_jquery);

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
			},
			setInterceptor: function setInterceptor(object, propertyName, value) {
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

	var SetterControl = _can2.default.Control({
		init: function init() {
			_proxy.getInterceptor(this, 'options').destination(_proxy.getInterceptor(this, 'options').source());
		},
		'{source} change': function sourceChange() {
			_proxy.getInterceptor(this, 'options').destination(_proxy.getInterceptor(this, 'options').source());
		},
		destroy: function destroy() {
			_proxy.getInterceptor(this, 'options').destination(_proxy.getInterceptor(_proxy.getInterceptor(this, 'options'), 'original'));
			this._super();
		}
	});

	exports.default = _proxy.getInterceptor(_can2.default, 'view').tag("model-set", function (element, tagData) {

		var paths = (0, _jquery2.default)(element).data();

		var sourceCompute = _proxy.getInterceptor(tagData, 'scope').compute(_proxy.getInterceptor(paths, 'source'));
		var destinationCompute = _proxy.getInterceptor(tagData, 'scope').compute(_proxy.getInterceptor(paths, 'destination'));
		var originalValue = destinationCompute();
		if (originalValue === undefined) {
			originalValue = null;
		}
		new SetterControl(element, { source: sourceCompute, destination: destinationCompute, original: originalValue });
	});
});
