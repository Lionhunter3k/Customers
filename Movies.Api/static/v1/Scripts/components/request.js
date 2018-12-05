define(['exports', 'can.full', 'jquery', 'services/http'], function (exports, _can, _jquery, _http) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _can2 = _interopRequireDefault(_can);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _http2 = _interopRequireDefault(_http);

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

	var requestViewModelCtor = _proxy.getInterceptor(_can2.default, 'Map').extend({
		define: {
			requestPromise: {
				get: function get() {
					if (_proxy.getInterceptor(this, 'url') !== null) {
						return (0, _http2.default)({
							type: 'GET',
							url: _proxy.getInterceptor(this, 'url')
						});
					} else {
						return null;
					}
				} },
			url: {
				type: 'string',
				value: null
			}
		}
	});

	exports.default = _proxy.getInterceptor(_can2.default, 'Component').extend({
		tag: "request",
		template: "<content/>",
		viewModel: requestViewModelCtor
	});
});
