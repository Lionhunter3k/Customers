import can from '../can.full';
import $ from 'jquery';
import _ from 'underscore';
import http from '../services/http';

export default can.Component.extend({
    tag: "ajax-pager",
    template: "<content/>",
    viewModel: can.Map.extend({
        prev: function () {
            if (this.canPrev === true) {
                this.offset = this.offset - limit;
            }
        },
        next: function () {
            if (this.canNext === true) {
                this.offset = this.offset + this.limit;
            }
        },
        changePage: function (pageNumber) {
            this.currentPage = pageNumber;
            return false;
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
            loading: {
                get: function (_lastSet, resolve) {
                    let promise = this.request;

                    if (promise.state() === "pending") {
                        promise.always(function () {
                            resolve(false);
                        });
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            paginatedItems: {
                get: function (_lastSet, resolve) {
                    let promise = this.request;

                    promise.done((data) => {
                        this.count = data.totalCount;
                        resolve(data.items);
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
                        var result = {};
                        result[this.additionalDataName] = data;
                        ajaxOptions.data = result;
                    }
                    else {
                        ajaxOptions.data = data;
                    }
                    ajaxOptions.data[this.limitName] = this.limit;
                    ajaxOptions.data[this.currentPageName] = this.currentPage;
                    if (this.stringify) {
                        ajaxOptions.data = JSON.stringify(ajaxOptions.data);
                    }
                    return ajaxOptions;
                }
            },
            request: {
                get: function (_requestOptions) {
                    return http(this.requestOptions);
                }
            },
            count: {
                type: "number",
                value: 0
            },
            offset: {
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
            this.element.trigger('selectedrows', [{ selectedIds: this.viewModel.selectedRows.attr() }]);
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
            this.viewModel.currentPage = 1;
        }
    }
});
