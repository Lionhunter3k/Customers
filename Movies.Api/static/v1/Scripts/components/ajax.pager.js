define(["can.full", "jquery", "underscore", "services/http"], function (can, jquery, underscore, http) {
	can.Component.extend({
		tag: "ajax-pager",
		template: "<content/>",
		viewModel: can.Map.extend({
			prev: function () {
				if (this.attr('canPrev') === true) {
					this.attr('offset', this.attr('offset') - this.attr('limit'))
				}
			},
			next: function () {
				if (this.attr('canNext') === true) {
					this.attr('offset', this.attr('offset') + this.attr('limit'));
				}
			},
			changePage: function (pageNumber) {
				this.attr('currentPage', pageNumber);
				return false;
			},
			isToggled: function (value) {
				var checked = this.attr('selectedRows').indexOf(value);
				//set checked based on if current checkbox's value is in selectedIds.
				return checked > -1;
			},
			toggle: function (value, toggle) {
				if (toggle !== undefined && toggle !== null) {
					if (toggle == true) {
						var checked = this.attr('selectedRows').indexOf(value)
						if (checked == -1) {
							//add id to selectedIds.
							this.attr('selectedRows').push(value);
						}
					}
					else {
						var checked = this.attr('selectedRows').indexOf(value)
						if (checked > -1) {
							//remove id from selectedIds.
							this.attr('selectedRows').splice(checked, 1);
						}
					}
				}
				else {
					var checked = this.attr('selectedRows').indexOf(value);
					if (checked == -1) {
						//add id to selectedIds.
						this.attr('selectedRows').push(value);
					}
					else {
						this.attr('selectedRows').splice(checked, 1);
					}
				}
			},
			define: {
				selectedRows: {
					Value: can.List,
					Type: can.List
				},
				additionalData: {
					value: null,
				},
				additionalDataName: {
					type: "string",
					value: null,
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
					get: function (lastSet, resolve) {
						var promise = this.attr("request");

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
				paginatedItems: {
					get: function (lastSet, resolve) {
						var promise = this.attr("request");

						promise.done(this.proxy(function (data) {
							this.attr('count', data.totalCount);
							resolve(data.items);
						}));
					}
				},
				requestOptions: {
					type: '*',
					get: function () {
						var ajaxOptions = {
							url: this.attr('read'),
							method: this.attr('readType'),
							traditional: true,
							dataType: this.attr("dataType"),
							contentType: this.attr('contentType')
						};
						var data = this.attr('additionalData');
						if (data == null) {
							data = {};
						}
						if (data.serialize)
							data = data.serialize();
						if (this.attr('additionalDataName')) {
							var result = {};
							if (this.attr('readType').toUpperCase() != 'GET') {
								addAntiForgeryToken(data);
							}
							result[this.attr('additionalDataName')] = data;
							ajaxOptions.data = result;
						}
						else {
							if (this.attr('readType').toUpperCase() != 'GET') {
								addAntiForgeryToken(data);
							}
							ajaxOptions.data = data;
						}
						ajaxOptions.data[this.attr('limitName')] = this.attr('limit');
						ajaxOptions.data[this.attr('currentPageName')] = this.attr('currentPage');
						if (this.attr('stringify')) {
							ajaxOptions.data = JSON.stringify(ajaxOptions.data);
						}
						return ajaxOptions;
					}
				},
				request: {
					get: function (requestOptions) {
						return $.ajax(this.attr('requestOptions'));
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
						var cannext = this.attr('offset') < this.attr('count') - this.attr('limit');
						return cannext;
					}
				},
				canPrev: {
					get: function () {
						var canprev = this.attr('offset') > 0
						return canprev;
					}
				},
				currentPage: {
					get: function () {
						return Math.floor(this.attr('offset') / this.attr('limit')) + 1;
					},
					set: function (newVal) {
						this.attr('offset', (parseInt(newVal, 10) - 1) * this.attr('limit'));
					}
				},
				pageCount: {
					get: function () {
						return this.attr('count') ?
							Math.ceil(this.attr('count') / this.attr('limit')) : null;
					}
				},
				hasPages: {
					get: function () {
						return this.attr('pageCount') > 1;
					}
				},
				pageLimit: {
					type: "number",
					value: 10
				},
				pages: {
					get: function () {
						var currentPage = this.attr('currentPage');
						var pageCount = this.attr('pageLimit');
						var pageOffset = currentPage - (pageCount / 2) > 0 ? Math.ceil(currentPage - (pageCount / 2)) : 0;
						var hasNonPage = true;
						if (pageOffset + pageCount > this.attr('pageCount')) {
							pageCount = this.attr('pageCount') - pageOffset;
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
				this.element.trigger('selectedrows', [{ selectedIds: this.viewModel.attr('selectedRows').attr() }]);
			},
			'{element} refresh': function () {
				this.viewModel.attr('request', this.viewModel.attr('requestOptions'));
			},
			'{element} clear': function () {
				this.viewModel.attr('selectedRows', []);
				this.element.trigger('refresh');
			},
			"{viewModel} additionalData set": 'resetGrid',
			"{additionalData} change": 'resetGrid',
			resetGrid: function () {
				this.viewModel.attr('currentPage', 1);
			}
		}
	});
});
