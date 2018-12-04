import can from "can.full";
import $ from "jquery";
import _ from 'underscore';

export default can.Component.extend({
    tag: "pager",
    template: "<content/>",
    viewModel: can.Map.extend({
        Prev: function () {
            if (this.CanPrev === true) {
                this.Offset = this.Offset - this.limit;
            }
        },
        Next: function () {
            if (this.CanNext === true) {
                this.Offset = this.Offset + this.limit;
            }
        },
        ChangePage: function (pageNumber) {
            this.CurrentPage = pageNumber;
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
            PaginatedItems: {
                get: function () {
                    if (this.items.length > 0) {
                        let pagedResults = Enumerable.From(this.items).Skip(this.Offset).Take(this.limit).ToArray();
                        return pagedResults;
                    }
                    else
                        return [];
                }
            },
            Count: {
                get: function () {
                    return this.items.length;
                }
            },
            Offset: {
                type: "number",
                value: 0
            },
            limit: {
                type: "number",
                value: 10
            },
            CanNext: {
                get: function () {
                    let cannext = this.Offset < this.Count - this.limit;
                    return cannext;
                }
            },
            CanPrev: {
                get: function () {
                    let canprev = this.Offset > 0;
                    return canprev;
                }
            },
            CurrentPage: {
                get: function () {
                    return Math.floor(this.Offset / this.limit) + 1;
                },
                set: function (newVal) {
                    this.Offset = (parseInt(newVal, 10) - 1) * this.limit;
                }
            },
            PageCount: {
                get: function () {
                    return this.Count ?
                        Math.ceil(this.Count / this.limit) : null;
                }
            },
            HasPages: {
                get: function () {
                    return this.PageCount > 1;
                }
            },
            pageLimit: {
                type: "number",
                value: 10
            },
            Pages: {
                get: function () {
                    let currentPage = this.CurrentPage;
                    let pageCount = this.pageLimit;
                    let pageOffset = currentPage - (pageCount / 2) > 0 ? Math.ceil(currentPage - (pageCount / 2)) : 0;
                    let hasNonPage = true;
                    if (pageOffset + pageCount > this.PageCount) {
                        pageCount = this.PageCount - pageOffset;
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
            this.viewModel.CurrentPage = 1;
        },
        '{items} remove': function () {
            this.viewModel.CurrentPage = 1;
        },
        "{viewModel} items set": function () {
            this.viewModel.CurrentPage = 1;
        }
    }
});