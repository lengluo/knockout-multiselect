/// <reference path="jquery-1.9.1.min.js.js" />
/// <reference path="knockout-2.2.1.debug.js.js" />
/// 
ko.bindingHandlers.multiselect = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        console.log('init');
        var accessor = valueAccessor();
        ko.renderTemplate("ko-multiselect-template", accessor, {}, element, 'replaceNode');
        console.log('init');
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        console.log('update');
        $('.ko-multiselect-container .dropdown-menu *').on('click', function (e) {
            e.stopPropagation();
        });
        console.log('update');
    }
};

    ko.knockoutMultiSelectViewModel = function (parameters) {
    var self = this;
    //knockout options
    self.options = ko.observableArray(parameters.options || []);
    self.selectedOptions = ko.observableArray(parameters.selectedOptions || []);
    self.optionsText = parameters.optionsText || '';
    self.optionsValue = parameters.optionsValue || '';

    //custom options
    self.originalOptions = ko.observableArray(parameters.options || []);


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