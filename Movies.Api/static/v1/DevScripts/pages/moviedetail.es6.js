import $ from 'jquery';
import can from '../can.full';
import template from './moviedetail.stache';

export default can.Component.extend({
	tag: "movie-detail",
	template: template,
	viewModel: can.Map.extend({
		define: {
			title: {
				get: function () {
					if (this.movie !== null) {
						return this.movie.headline;
					}
					return '';
				}
			},
			movieUrl: {
				get: function () {
					if (this.location.slug) {
						return '/api/movies/?id=' + this.location.slug;
					}
					return '';
				}
			},
			movie: {
				Type: can.Map,
				value: null
			},
			location: {
				Value: can.Map
			}
		}
	})
});