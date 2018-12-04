import can from "can.full";
import $ from "jquery";
import _ from 'underscore';

export default can.Component.extend({
    tag: "ajax-pager",
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
            additionalData: {
                value: null
            },
            additionalDataName: {
                type: "string",
                value: null
            },
            read: {
                type: "string",
                value: null
            },
            readType: {
                type: "string",
                value: "POST"
            },
            Loading: {
                get: function (_lastSet, resolve) {
                    let promise = this.request;

                    if (promise.state() === "pending") {
                        promise.then(function () {
                            resolve(false);
                        });
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            PaginatedItems: {
                get: function (_lastSet, resolve) {
                    let promise = this.request;

                    promise.done((data) => {
                        this.Count = data.TotalCount;
                        resolve(data.Items);
                    });
                }
            },
            requestOptions: {
                type: '*',
                get: function () {
                    let ajaxOptions = {
                        url: this.read,
                        method: this.readType,
                        traditional: true,
                        dataType: this.dataType,
                        contentType: this.contentType
                    };
                    let data = this.additionalData;
                    if (data === null) {
                        data = {};
                    }
                    if (data.serialize)
                        data = data.serialize();
                    if (this.additionalDataName) {
                        let result = {};
                        result[this.additionalDataName] = data;
                        ajaxOptions.data = result;
                    }
                    else {
                        ajaxOptions.data = data;
                    }
                    ajaxOptions.data[this.limitName] = this.limit;
                    ajaxOptions.data[this.currentPageName] = this.CurrentPage;
                    if (this.stringify) {
                        ajaxOptions.data = JSON.stringify(ajaxOptions.data);
                    }
                    return ajaxOptions;
                }
            },
            request: {
                get: function (_requestOptions) {
                    return $.ajax(this.requestOptions);
                }
            },
            Count: {
                type: "number",
                value: 0
            },
            Offset: {
                type: "number",
                value: 0
            },
            limit: {
                type: "number",
                value: 10
            },
            limitName: {
                type: 'string',
                value: 'limit'
            },
            currentPageName: {
                type: 'string',
                value: 'currentPage'
            },
            dataType: {
                type: 'string',
                value: 'json'
            },
            contentType: {
                type: 'string',
                value: 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            stringify: {
                type: 'boolean',
                value: false
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
                    var hasNonPage = true;
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
        '{element} refresh': function () {
            this.viewModel.request = this.viewModel.requestOptions;
        },
        '{element} clear': function () {
            this.viewModel.selectedRows = [];
            this.element.trigger('refresh');
        },
        "{viewModel} additionalData set": 'resetGrid',
        "{additionalData} change": 'resetGrid',
        resetGrid: function () {
            this.viewModel.CurrentPage = 1;
        }
    }
});