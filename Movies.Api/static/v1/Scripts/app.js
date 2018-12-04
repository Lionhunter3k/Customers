define(['exports', 'can.full', 'jquery', 'stache!app.stache'], function (exports, _can, _jquery, _stacheApp) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _can2 = _interopRequireDefault(_can);

    var _jquery2 = _interopRequireDefault(_jquery);

    var _stacheApp2 = _interopRequireDefault(_stacheApp);

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

    var appCtor = _proxy.getInterceptor(_can2.default, 'Control').extend({}, {
        setup: function setup(element, options) {
            options = options || {};
            _can2.default.route('/v1/movies/:page', { page: 'movielist' });
            _can2.default.route('/v1/movies/:page/:slug', { slug: null });
            _proxy.setInterceptor(options, 'appState', new (_proxy.getInterceptor(_can2.default, 'Map'))({ location: {}, title: '' }));
            _proxy.getInterceptor(_can2.default, 'route').map(_proxy.getInterceptor(_proxy.getInterceptor(options, 'appState'), 'location'));
            return this._super(element, options);
        }, init: function init(element, _options) {
            //init routing
            _proxy.getInterceptor(_can2.default, 'route').ready();
            //init templating
            element.html((0, _stacheApp2.default)(_proxy.getInterceptor(_proxy.getInterceptor(this, 'options'), 'appState')));
        },
        'a[href="#"] click': function aHrefClick(_el, ev) {
            ev.preventDefault();
        },
        'form submit': function formSubmit(_el, ev) {
            ev.preventDefault();
        },
        // the route has changed
        "{appState} location change": function appStateLocationChange() {
            (0, _jquery2.default)('body, html').scrollTop(0);
        }
    });

    exports.default = appCtor;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5lczYuanMiXSwibmFtZXMiOlsid2luZG93IiwiX3Byb3h5IiwiZ2V0SW50ZXJjZXB0b3IiLCJvYmplY3QiLCJwcm9wZXJ0eU5hbWUiLCJhdHRyIiwiX2RhdGEiLCJzZXRJbnRlcmNlcHRvciIsInZhbHVlIiwidXBkYXRlUG9zdGZpeEFkZEludGVyY2VwdG9yIiwib3JpZ2luYWwiLCJ1cGRhdGVQb3N0Zml4U3VidHJhY3RJbnRlcmNlcHRvciIsImFwcEN0b3IiLCJleHRlbmQiLCJzZXR1cCIsImVsZW1lbnQiLCJvcHRpb25zIiwiY2FuIiwicm91dGUiLCJwYWdlIiwic2x1ZyIsImxvY2F0aW9uIiwidGl0bGUiLCJtYXAiLCJfc3VwZXIiLCJpbml0IiwiX29wdGlvbnMiLCJyZWFkeSIsImh0bWwiLCJfZWwiLCJldiIsInByZXZlbnREZWZhdWx0Iiwic2Nyb2xsVG9wIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUMsUUFBSSxDQUFDQSxPQUFPQyxNQUFaLEVBQW9CO0FBQ2pCRCxlQUFPQyxNQUFQLEdBQWdCO0FBQ1pDLDRCQUFnQix3QkFBVUMsTUFBVixFQUFrQkMsWUFBbEIsRUFBZ0M7QUFDNUMsb0JBQUlELE9BQU9FLElBQVAsSUFBZUYsT0FBT0csS0FBdEIsSUFBK0JILE9BQU9HLEtBQVAsQ0FBYUYsWUFBYixDQUFuQyxFQUErRDtBQUMzRCwyQkFBT0QsT0FBT0UsSUFBUCxDQUFZRCxZQUFaLENBQVA7QUFDSCxpQkFDRCxPQUFPRCxPQUFPQyxZQUFQLENBQVA7QUFDSCxhQU5XLEVBT1pHLGdCQUFnQix3QkFBVUosTUFBVixFQUFrQkMsWUFBbEIsRUFBZ0NJLEtBQWhDLEVBQXVDO0FBQ25ELG9CQUFJTCxPQUFPRSxJQUFYLEVBQWlCO0FBQ2IsMkJBQU9GLE9BQU9FLElBQVAsQ0FBWUQsWUFBWixFQUEwQkksS0FBMUIsQ0FBUDtBQUNILGlCQUZELE1BR0s7QUFDRCwyQkFBT0wsT0FBT0MsWUFBUCxJQUF1QkksS0FBOUI7QUFDSDtBQUNKLGFBZFcsRUFlWkMsNkJBQTZCLHFDQUFVTixNQUFWLEVBQWtCQyxZQUFsQixFQUFnQztBQUN6RCxvQkFBSU0sV0FBVyxLQUFLUixjQUFMLENBQW9CQyxNQUFwQixFQUE0QkMsWUFBNUIsQ0FBZixDQUNBLEtBQUtHLGNBQUwsQ0FBb0JKLE1BQXBCLEVBQTRCQyxZQUE1QixFQUEwQ00sV0FBVyxDQUFyRCxFQUNBLE9BQU9BLFFBQVA7QUFDSCxhQW5CVyxFQW9CWkMsa0NBQWtDLDBDQUFVUixNQUFWLEVBQWtCQyxZQUFsQixFQUFnQ0ksS0FBaEMsRUFBdUM7QUFDckUsb0JBQUlFLFdBQVcsS0FBS1IsY0FBTCxDQUFvQkMsTUFBcEIsRUFBNEJDLFlBQTVCLENBQWYsQ0FDQSxLQUFLRyxjQUFMLENBQW9CSixNQUFwQixFQUE0QkMsWUFBNUIsRUFBMENJLFFBQVEsQ0FBbEQsRUFDQSxPQUFPRSxRQUFQO0FBQ0gsYUF4QlcsRUFBaEI7QUEwQkg7O0FBdkJELFFBQUlFLFVBQVUsZ0RBQVlDLE1BQVosQ0FBbUIsRUFBbkIsRUFBdUI7QUFDN0JDLGVBQU8sZUFBVUMsT0FBVixFQUFtQkMsT0FBbkIsRUFBNEI7QUFDL0JBLHNCQUFVQSxXQUFXLEVBQXJCO0FBQ0FDLDBCQUFJQyxLQUFKLENBQVUsa0JBQVYsRUFBOEIsRUFBRUMsTUFBTSxXQUFSLEVBQTlCO0FBQ0FGLDBCQUFJQyxLQUFKLENBQVUsd0JBQVYsRUFBb0MsRUFBRUUsTUFBTSxJQUFSLEVBQXBDO0FBQ0EsdURBQW1CLDJCQUFJSCxhQUFKLFVBQVksRUFBRUksVUFBVSxFQUFaLEVBQWdCQyxPQUFPLEVBQXZCLEVBQVosQ0FBbkI7QUFDQSwwREFBVUMsR0FBViw2Q0FBY1AsT0FBZDtBQUNBLG1CQUFPLEtBQUtRLE1BQUwsQ0FBWVQsT0FBWixFQUFxQkMsT0FBckIsQ0FBUDtBQUNILFNBUjRCLEVBUzdCUyxNQUFNLGNBQVVWLE9BQVYsRUFBbUJXLFFBQW5CLEVBQTZCO0FBQy9CO0FBQ0EsMERBQVVDLEtBQVY7QUFDQTtBQUNBWixvQkFBUWEsSUFBUixDQUFhLHFFQUFTLElBQVQsMEJBQWI7QUFDSCxTQWQ0QjtBQWU3Qiw2QkFBcUIsb0JBQVVDLEdBQVYsRUFBZUMsRUFBZixFQUFtQjtBQUNwQ0EsZUFBR0MsY0FBSDtBQUNILFNBakI0QjtBQWtCN0IsdUJBQWUsb0JBQVVGLEdBQVYsRUFBZUMsRUFBZixFQUFtQjtBQUM5QkEsZUFBR0MsY0FBSDtBQUNILFNBcEI0QjtBQXFCN0I7QUFDQSxzQ0FBOEIsa0NBQVk7QUFDdEMsa0NBQUUsWUFBRixFQUFnQkMsU0FBaEIsQ0FBMEIsQ0FBMUI7QUFDSDtBQXhCNEIsS0FBdkIsQ0FBZDs7c0JBNEJlcEIsTyIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyLvu79pbXBvcnQgY2FuIGZyb20gJ2Nhbi5mdWxsJztcclxuaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcclxuaW1wb3J0IHRlbXBsYXRlIGZyb20gJ3N0YWNoZSFhcHAuc3RhY2hlJztcclxuXHJcbnZhciBhcHBDdG9yID0gY2FuLkNvbnRyb2wuZXh0ZW5kKHt9LCB7XHJcbiAgICAgICAgc2V0dXA6IGZ1bmN0aW9uIChlbGVtZW50LCBvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG4gICAgICAgICAgICBjYW4ucm91dGUoJy92MS9tb3ZpZXMvOnBhZ2UnLCB7IHBhZ2U6ICdtb3ZpZWxpc3QnIH0pO1xyXG4gICAgICAgICAgICBjYW4ucm91dGUoJy92MS9tb3ZpZXMvOnBhZ2UvOnNsdWcnLCB7IHNsdWc6IG51bGwgfSk7XHJcbiAgICAgICAgICAgIG9wdGlvbnMuYXBwU3RhdGUgPSBuZXcgY2FuLk1hcCh7IGxvY2F0aW9uOiB7fSwgdGl0bGU6ICcnIH0pO1xyXG4gICAgICAgICAgICBjYW4ucm91dGUubWFwKG9wdGlvbnMuYXBwU3RhdGUubG9jYXRpb24pO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc3VwZXIoZWxlbWVudCwgb3B0aW9ucyk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBpbml0OiBmdW5jdGlvbiAoZWxlbWVudCwgX29wdGlvbnMpIHtcclxuICAgICAgICAgICAgLy9pbml0IHJvdXRpbmdcclxuICAgICAgICAgICAgY2FuLnJvdXRlLnJlYWR5KCk7XHJcbiAgICAgICAgICAgIC8vaW5pdCB0ZW1wbGF0aW5nXHJcbiAgICAgICAgICAgIGVsZW1lbnQuaHRtbCh0ZW1wbGF0ZSh0aGlzLm9wdGlvbnMuYXBwU3RhdGUpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgICdhW2hyZWY9XCIjXCJdIGNsaWNrJzogZnVuY3Rpb24gKF9lbCwgZXYpIHtcclxuICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgICdmb3JtIHN1Ym1pdCc6IGZ1bmN0aW9uIChfZWwsIGV2KSB7XHJcbiAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyB0aGUgcm91dGUgaGFzIGNoYW5nZWRcclxuICAgICAgICBcInthcHBTdGF0ZX0gbG9jYXRpb24gY2hhbmdlXCI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCgnYm9keSwgaHRtbCcpLnNjcm9sbFRvcCgwKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBhcHBDdG9yO1xyXG4iXX0=
