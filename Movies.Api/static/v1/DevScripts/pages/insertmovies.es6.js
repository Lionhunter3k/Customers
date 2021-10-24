import $ from 'jquery';
import can from '../can.full';
import template from './insertmovies.stache';
import http from '../services/http';

export default can.Component.extend({
    tag: "insert-movies",
    template: template,
    viewModel: can.Map.extend({
        define: {
            title: {
                type: 'string',
                value: 'Insert movies'
			},
			file: {
				type: '*'
			},
			location: {
				Value: can.Map
			}
		},
		sendFile: async function ($form) {
			let data = new FormData();
			if (this.file[0].files.length > 0) {
				data.append('dataSet', this.file[0].files[0]);
			}
			let fileUploadRequest = http({
				url: '/api/movies',
				data: data,
				processData: false,
				contentType: false,
				type: 'POST'
			});
			this.requestPromise = fileUploadRequest;
			var result = await fileUploadRequest;
			$form.trigger('reset');

		}
    })
});