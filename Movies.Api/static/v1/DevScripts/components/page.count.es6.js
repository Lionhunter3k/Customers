import can from '../can.full';
import $ from 'jquery';
import 'bootpag';

export default can.Component.extend({
    tag: "page-count",
    viewModel: can.Map.extend({
        define: {
            currentPage: {
                type: 'number',
                set: function (value) {
                    if (value === undefined || value === null || value < 1) {
                        return 1;
                    }
                    else {
                        return value;
                    }
                }
            },
            pageCount: {
                type: 'number',
                set: function (value) {
                    if (value === undefined || value === null || value < 1) {
                        return 1;
                    }
                    else {
                        return value;
                    }
                }
            },
            maxpages: {
                type: 'number',
                set: function (value) {
                    if (value === undefined || value === null || value < 1) {
                        return 1;
                    }
                    else {
                        return value;
                    }
                }
            }
        }
    }),
    events: {
        inserted: 'syncPager',
        '{currentPage} change': 'syncPager',
        '{pageCount} change': 'syncPager',
        '{maxpages} change': 'syncPager',
        '{viewModel} currentPage set': 'syncPager',
        '{viewModel} pageCount set': 'syncPager',
        '{viewModel} maxpages set': 'syncPager',
        syncPager: function () {
            let options = {
                total: this.viewModel.pageCount,
                page: this.viewModel.currentPage,
                maxVisible: this.viewModel.maxpages
            };
            $(this.element).bootpag(options);
        },
        '{element} page': function (_el, _ev, data) {
            this.viewModel.currentPage = data;
        }
    }
})