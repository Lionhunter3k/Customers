import can from 'can.full';
import $ from "jquery";
import http from 'services/http'

let requestViewModelCtor = can.Map.extend({
	define: {
		requestPromise: {
			get: function () {
				if (this.url !== null) {
					return http({
						type: 'GET',
						url: this.url
					});
				}
				else {
					return null;
				}
			}
		},
		url: {
			type: 'string',
			value: null
		}
	}
});

export default can.Component.extend({
	tag: "request",
	template: "<content/>",
	viewModel: requestViewModelCtor
});