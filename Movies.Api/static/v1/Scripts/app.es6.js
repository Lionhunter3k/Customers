import can from 'can.full';
import $ from 'jquery';
import template from 'stache!app.stache';

var appCtor = can.Control.extend({}, {
        setup: function (element, options) {
            options = options || {};
            can.route('/v1/movies/:page', { page: 'movielist' });
            can.route('/v1/movies/:page/:slug', { slug: null });
            options.appState = new can.Map({ location: {}, title: '' });
            can.route.map(options.appState.location);
            return this._super(element, options);
        },
        init: function (element, _options) {
            //init routing
            can.route.ready();
            //init templating
            element.html(template(this.options.appState));
        },
        'a[href="#"] click': function (_el, ev) {
            ev.preventDefault();
        },
        'form submit': function (_el, ev) {
            ev.preventDefault();
        },
        // the route has changed
        "{appState} location change": function () {
            $('body, html').scrollTop(0);
        }
    });


export default appCtor;
