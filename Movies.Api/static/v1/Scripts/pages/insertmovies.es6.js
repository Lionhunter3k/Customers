import $ from 'jquery';
import can from 'can.full';
import template from 'stache!pages/insertmovies.stache';

export default can.Component.extend({
    tag: "insertmovies",
    template: template,
    viewModel: can.Map.extend({
        define: {
            title: {
                type: 'string',
                value: 'Insert movies'
            }
        }
    })
});