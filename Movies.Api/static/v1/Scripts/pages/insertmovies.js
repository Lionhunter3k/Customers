define(['exports', 'jquery', 'can.full', 'stache!pages/insertmovies.stache', 'services/http'], function (exports, _jquery, _can, _insertmovies, _http) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _jquery2 = _interopRequireDefault(_jquery);

	var _can2 = _interopRequireDefault(_can);

	var _insertmovies2 = _interopRequireDefault(_insertmovies);

	var _http2 = _interopRequireDefault(_http);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	function _asyncToGenerator(fn) {
		return function () {
			var gen = fn.apply(this, arguments);
			return new Promise(function (resolve, reject) {
				function step(key, arg) {
					try {
						var info = gen[key](arg);
						var value = info.value;
					} catch (error) {
						reject(error);
						return;
					}

					if (info.done) {
						resolve(value);
					} else {
						return Promise.resolve(value).then(function (value) {
							step("next", value);
						}, function (err) {
							step("throw", err);
						});
					}
				}

				return step("next");
			});
		};
	}

	if (!window._proxy) {
		window._proxy = {
			getInterceptor: function getInterceptor(object, propertyName) {
				if (object.attr && (object._data && object._data[propertyName] || object._computedAttrs && object._computedAttrs[propertyName] && object._computedAttrs[propertyName].compute)) {
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
				},
				file: {
					type: '*'
				},
				location: {
					Value: _proxy.getInterceptor(_can2.default, 'Map')
				}
			},
			sendFile: function () {
				var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee($form) {
					var data, fileUploadRequest, result;
					return regeneratorRuntime.wrap(function _callee$(_context) {
						while (1) {
							switch (_context.prev = _context.next) {
								case 0:
									data = new FormData();

									if (_proxy.getInterceptor(_proxy.getInterceptor(_proxy.getInterceptor(_proxy.getInterceptor(this, 'file'), 0), 'files'), 'length') > 0) {
										data.append('dataSet', _proxy.getInterceptor(_proxy.getInterceptor(_proxy.getInterceptor(_proxy.getInterceptor(this, 'file'), 0), 'files'), 0));
									}
									fileUploadRequest = (0, _http2.default)({
										url: '/api/movies',
										data: data,
										processData: false,
										contentType: false,
										type: 'POST'
									});

									_proxy.setInterceptor(this, 'requestPromise', fileUploadRequest);
									_context.next = 6;
									return fileUploadRequest;

								case 6:
									result = _context.sent;

									$form.trigger('reset');

								case 8:
								case 'end':
									return _context.stop();
							}
						}
					}, _callee, this);
				}));

				function sendFile(_x) {
					return _ref.apply(this, arguments);
				}

				return sendFile;
			}()
		})
	});
});
