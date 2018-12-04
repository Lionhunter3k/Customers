import $ from 'jquery';
import can from 'can.full';
import template from 'stache!pages/movielist.stache';

export default can.Component.extend({
    tag: "movielist",
    template: template,
    viewModel: can.Map.extend({
        define: {
            title: {
                get: function () {
                    return "View movies";
                }
            },
            location: {
                Value: can.Map
            }
        }
    })
});