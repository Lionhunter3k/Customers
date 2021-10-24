import can from '../can.full';
import _ from 'lodash';

var Value = can.Control({
    init: function () {
        this.setFromModel();
    },
    "{value} change": "setFromModel",
    setFromModel: function () {
        this.element.val(this.options.value());
    },
    setFromControl: function () {
        this.setFromControlDebounced.cancel();
        this.options.value(this.element.val());
    },
    setFromControlDebounced: _.debounce(function () {
        this.setFromControl();
    }, 300),
    "keyup": 'setFromControlDebounced',
    "input": 'setFromControl',
    "change": 'setFromControl'
});

export default can.view.attr("can-model-value", function (element, attrData) {

    var valuePath = element.getAttribute("can-model-value");
    var valueCompute = attrData.scope.compute(valuePath);

    new Value(element, { value: valueCompute });
});