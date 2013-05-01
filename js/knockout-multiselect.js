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