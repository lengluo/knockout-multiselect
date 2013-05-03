/// <reference path="jquery-1.9.1.min.js.js" />
/// <reference path="knockout-2.2.1.debug.js.js" />
/// 
ko.bindingHandlers.multiselect = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var accessor = valueAccessor();
        var opt = $(element)[0].options[0];

        if (opt) {
            accessor.originalOptions([]);
            accessor.options([]);
            $.each($(element)[0].options, function (index, value) {
                if (!(accessor.optionsText || accessor.optionsValue)) {
                    accessor.originalOptions.push(value.text);
                    if (value.selected) accessor.selectedOptions.push(value.text);
                } else {
                    var option = {};
                    if (accessor.optionsText) option[accessor.optionsText] = value.text;
                    if (accessor.optionsValue) option[accessor.optionsValue || accessor.optionsText] = value.value || value.text;
                    if (value.selected) accessor.selectedOptions.push(accessor.getValueFor(option));
                    accessor.originalOptions.push(option);
                }
            });
            accessor.options(accessor.originalOptions());
        }
        ko.renderTemplate("ko-multiselect-template", accessor, {}, element, 'replaceNode');
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        $('.ko-multiselect-container .dropdown-menu *').on('click', function (e) {
            e.stopPropagation();
        });
    }
};

ko.knockoutMultiSelectViewModel = function (parameters) {
    var self = this;
    //knockout options
    self.options = ko.observableArray(parameters.options || []);
    self.selectedOptions = ko.observableArray(parameters.selectedOptions || []);
    self.optionsText = parameters.optionsText || '';
    self.optionsValue = parameters.optionsValue || '';
    self.buttonText = ko.computed(function() {
        if (self.selectedOptions().length == 0) return 'Selecione';
        if (self.selectedOptions().length == 1) return '1 selecionado';
        return self.selectedOptions().length.toString() + ' selecionados';
    });

    //custom options
    self.originalOptions = ko.observableArray(parameters.options || []);
    self.containerClasses = parameters.containerClasses || {};
    self.buttonClasses = parameters.buttonClasses || {};


    self.filter = ko.observable('');
    self.enableSearch = ko.observable(parameters.enableSearch || false);
    self.enableSelectAll = ko.observable(parameters.enableSelectAll || false);

    self.selectAll = function () {
        if (!(self.optionsValue || self.optionsText)) {
            self.selectedOptions(self.options());
            return;
        }

        self.selectedOptions([]);
        $.each(self.options(), function (index, value) {
            self.selectedOptions.push(value[self.optionsValue || self.optionsText].toString());
        });
    };

    self.clearSelected = function () {
        self.selectedOptions([]);
    };

    self.getValueFor = function (data) {
        if (self.optionsValue || self.optionsText) return data[self.optionsValue || self.optionsText];
        return data;
    };

    self.getTextFor = function (data) {
        if (self.optionsText) return data[self.optionsText];
        return data;
    };

    self.filter.subscribe(function (newValue) {

        if (!newValue) {
            self.options(self.originalOptions());
            return;
        }

        self.options([]);
        var array = self.originalOptions();
        for (var i = 0; i < array.length; i++) {
            var item = array[i];
            if (self.getTextFor(item).substring(0, self.filter().length).toLowerCase() == self.filter().toLowerCase()) {
                self.options.push(item);
            }
        }
    });
};