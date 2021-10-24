import can from "../can.full";
import $ from "jquery";
import _ from 'underscore';

export default can.Component.extend({
    tag: "pager",
    template: "<content/>",
    viewModel: can.Map.extend({
        prev: function () {
            if (this.canPrev === true) {
				this.offset = this.offset - this.limit;
            }
        },
        next: function () {
            if (this.canNext === true) {
				this.offset = this.offset + this.limit;
            }
        },
        changePage: function (pageNumber) {
            this.currentPage = pageNumber;
        },
        isToggled: function (value) {
            let checked = this.selectedRows.indexOf(value);
            //set checked based on if current checkbox's value is in selectedIds.
            return checked > -1;
        },
        toggle: function (value, toggle) {
            if (toggle !== undefined && toggle !== null) {
                if (toggle === true) {
                    let checked = this.selectedRows.indexOf(value);
                    if (checked === -1) {
                        //add id to selectedIds.
                        this.selectedRows.push(value);
                    }
                }
                else {
                    let checked = this.selectedRows.indexOf(value);
                    if (checked > -1) {
                        //remove id from selectedIds.
                        this.selectedRows.splice(checked, 1);
                    }
                }
            }
            else {
                let checked = this.selectedRows.indexOf(value);
                if (checked === -1) {
                    //add id to selectedIds.
                    this.selectedRows.push(value);
                }
                else {
                    this.selectedRows.splice(checked, 1);
                }
            }
        },
        define: {
            selectedRows: {
                Value: can.List,
                Type: can.List
            },
            items: {
                Type: can.List,
                Value: can.List
            },
            paginatedItems: {
                get: function () {
                    if (this.items.length > 0) {
                        let pagedResults = Enumerable.From(this.items).Skip(this.offset).Take(this.limit).ToArray();
                        return pagedResults;
                    }
                    else
                        return [];
                }
            },
            count: {
                get: function () {
                    return this.items.length;
                }
            },
            offset: {
                type: "number",
                value: 0
            },
            limit: {
                type: "number",
                value: 10
            },
            canNext: {
                get: function () {
					let cannext = this.offset < this.count - this.limit;
                    return cannext;
                }
            },
            canPrev: {
                get: function () {
					let canprev = this.offset > 0;
                    return canprev;
                }
            },
            currentPage: {
                get: function () {
					return Math.floor(this.offset / this.limit) + 1;
                },
                set: function (newVal) {
					this.offset = (parseInt(newVal, 10) - 1) * this.limit;
                }
            },
            pageCount: {
                get: function () {
					return this.count ?
						Math.ceil(this.count / this.limit) : null;
                }
            },
            hasPages: {
                get: function () {
					return this.pageCount > 1;
                }
            },
            pageLimit: {
                type: "number",
                value: 10
            },
            pages: {
                get: function () {
                    let currentPage = this.currentPage;
                    let pageCount = this.pageLimit;
                    let pageOffset = currentPage - (pageCount / 2) > 0 ? Math.ceil(currentPage - (pageCount / 2)) : 0;
                    let hasNonPage = true;
                    if (pageOffset + pageCount > this.pageCount) {
                        pageCount = this.pageCount - pageOffset;
                        hasNonPage = false;
                    }
                    return new can.List(_.times(hasNonPage ? pageCount + 1 : pageCount, function (i) {
                        if (i < pageCount) {
                            return {
                                pageNumber: pageOffset + i,
                                pageTitle: pageOffset + i + 1,
                                isActive: pageOffset + i + 1 === currentPage,
                                isPage: true
                            };
                        }
                        else {
                            return {
                                pageTitle: '...',
                                isPage: false
                            };
                        }
                    }));
                }
            }
        }
    }),
    events: {
        '{selectedRows} change': function () {
            this.element.trigger('selectedrows', [{ selectedIds: this.viewModel.selectedRows.serialize() }]);
        },
        '{element} clear': function () {
            this.viewModel.selectedRows = [];
        },
        '{items} add': function () {
            this.viewModel.currentPage = 1;
        },
        '{items} remove': function () {
            this.viewModel.currentPage = 1;
        },
        "{viewModel} items set": function () {
            this.viewModel.currentPage = 1;
        }
    }
});