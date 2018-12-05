define(['exports', 'jquery', 'can.full', 'postal'], function (exports, _jquery, _can, _postal) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (ajaxOptions) {
		var $ajaxPromise = _jquery2.default.ajax(ajaxOptions);
		var resultPromise = _can2.default.Deferred();
		$ajaxPromise.done(_can2.default.proxy(_proxy.getInterceptor(resultPromise, 'resolve'), resultPromise)).fail(function (error) {
			try {
				var errorResponse = JSON.parse(_proxy.getInterceptor(error, 'responseText'));
				var errorModel = { errorStatus: _proxy.getInterceptor(error, 'status'), error: errorResponse };
				resultPromise.reject(errorModel);
			} catch (e) {
				if (_proxy.getInterceptor(error, 'responseText') !== undefined && _proxy.getInterceptor(error, 'responseText') !== null) {
					var _errorModel = { errorStatus: _proxy.getInterceptor(error, 'status'), error: _proxy.getInterceptor(error, 'responseText') };
					resultPromise.reject(_errorModel);
				} else {
					var _errorModel2 = { errorStatus: _proxy.getInterceptor(error, 'status') };
					resultPromise.reject(_errorModel2);
				}
			}
		});
		return resultPromise.promise().fail(function (error) {
			channel.publish("http.error." + _proxy.getInterceptor(error, 'errorStatus'), {
				ajaxOptions: ajaxOptions,
				error: error
			});
		});
	};

	var _jquery2 = _interopRequireDefault(_jquery);

	var _can2 = _interopRequireDefault(_can);

	var _postal2 = _interopRequireDefault(_postal);

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

	var channel = _postal2.default.channel("ajax");
});
