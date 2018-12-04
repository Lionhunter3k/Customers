﻿import can from 'can.full';
import $ from 'jquery';
import parsley from 'parsley';
import Enumerable from "Enumerable";

var validationControlCtor = can.Control({
    init: function (element, options) {
        if (element.is('form')) {
            element.parsley();
        }
    },
    '{isEnabled} change': function () {
        this.element.find(':input').each((_i, v) => {
            if (this.options.isEnabled()) {
                v.parsley().destroy();
            }
            else {
                v.parsley();
            }
        });
    },
    validateOnSubmit: function () {
        if (!this.options.enabledOnSubmit()) {
            if (this.options.isEnabled()) {
                this.element.find(':input').each((_i, v) => {
                    v.parsley().destroy();
                });
                this.options.isEnabled(false);
            }
        }
        else {
            if (!this.options.isEnabled()) {
                this.element.find(':input').each((_i, v) => {
                    v.parsley();
                });
                this.options.isEnabled(true);
            }
        }
    },
    '{window} {submitButtonSelector} click': "validateOnSubmit",
    'submit': "validateOnSubmit",
    '.js-validate-section click': function () {
        //make sure the inputs have their validations set to true
        if (!this.options.isEnabled()) {
            this.options.isEnabled(true);
        }
        let valid = true;
        this.element.find(':input').not(':disabled').each((_i, v) => {
            valid = v.parsley().isValid() && valid;//TODO_CHECK PARSLEY
        });

        this.options.valid(valid);

        this.element.trigger('parsley.validate', [this.options.valid()]);

        if (valid) {
            this.element.trigger('parsley.valid', []);
        }
        else {
            this.element.trigger('parsley.invalid', []);
        }
    },
    '.js-reset-section click': function () {
        this.element.find(':input').each((_i, v) => {
            v.parsley().reset();
        });
        this.viewModel.valid(true);
        this.element.trigger('parsley.reset', []);
    }
});

export default can.view.attr("parsley-validate", function (element, attrData) {

    let data = $(element).data();

    let isEnabledPath = element.getAttribute("parsley-is-enabled");
    let isEnabledCompute = isEnabledPath ? attrData.scope.compute(isEnabledPath) : can.compute(data.isEnabled || true);

    let validPath = element.getAttribute("parsley-valid");
    let validCompute = validPath ? attrData.scope.compute(isEnabledPath) : can.compute();

    let enabledOnSubmitPath = element.getAttribute("parsley-enabled-on-submit");
    let enabledOnSubmitCompute = enabledOnSubmitPath ? attrData.scope.compute(enabledOnSubmitPath) : can.compute(data.enabledOnSubmit || true);

    let submitButtonSelector = data.parsleySubmitButtonSelector;

    new validationControlCtor(element, { isEnabled: isEnabledCompute, valid: validCompute, enabledOnSubmit: enabledOnSubmitCompute, submitButtonSelector: submitButtonSelector });
});