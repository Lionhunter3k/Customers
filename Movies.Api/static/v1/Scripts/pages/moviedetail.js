define(['exports', 'jquery', 'can.full', 'stache!pages/moviedetail.stache'], function (exports, _jquery, _can, _moviedetail) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _jquery2 = _interopRequireDefault(_jquery);

	var _can2 = _interopRequireDefault(_can);

	var _moviedetail2 = _interopRequireDefault(_moviedetail);

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
	}exports.default = _proxy.getInterceptor(_can2.default, 'Component').extend({
		tag: "movie-detail",
		template: _moviedetail2.default,
		viewModel: _proxy.getInterceptor(_can2.default, 'Map').extend({
			define: {
				title: {
					get: function get() {
						if (_proxy.getInterceptor(this, 'movie') !== null) {
							return _proxy.getInterceptor(_proxy.getInterceptor(this, 'movie'), 'headline');
						}
						return '';
					}
				},
				movieUrl: {
					get: function get() {
						if (_proxy.getInterceptor(_proxy.getInterceptor(this, 'location'), 'slug')) {
							return '/api/movies/?id=' + _proxy.getInterceptor(_proxy.getInterceptor(this, 'location'), 'slug');
						}
						return '';
					} },
				movie: {
					Type: _proxy.getInterceptor(_can2.default, 'Map'),
					value: null
				},
				location: {
					Value: _proxy.getInterceptor(_can2.default, 'Map')
				}
			}
		})
	});
});
