define(['jquery', 'underscore', 'can'], function ($, _, can) {

	var SetterControl = can.Control({
		init: function () {
			this.options.destination(this.options.source());
		},
		'{source} change': function () {
			this.options.destination(this.options.source());
		},
		destroy: function () {
			this.options.destination(this.options.original);
			this._super();
		}
	});

	can.view.tag("model-set", function (element, tagData) {

		var paths = $(element).data();

		var sourceCompute = tagData.scope.compute(paths.source);
		var destinationCompute = tagData.scope.compute(paths.destination);
		var originalValue = destinationCompute();
		if (originalValue === undefined) {
			originalValue = null;
		}
		new SetterControl(element, { source: sourceCompute, destination: destinationCompute, original: originalValue });
	});

});