(function () {
    "use strict";

    angular
        .module("Application")
        .directive("customDatepicker", CustomDatepicker);

    CustomDatepicker.$inject = ["$rootScope", "APP_CONSTANT"];

    function CustomDatepicker($rootScope, APP_CONSTANT) {
        var exports = {
            replace: true,
            templateUrl: 'app/shared/custom-datepicker/custom-datepicker.html',
            scope: {
                model: '='
            },
            link: Link
        };
        return exports;

        function Link(scope, ele, attr) {
            scope.options = APP_CONSTANT.DatePicker.dateOptions;

            scope.open = function () {
                scope.opened = true;
            }
        }
    }
})();
