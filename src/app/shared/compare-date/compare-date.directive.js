(function () {
    "use strict";

    angular
        .module("Application")
        .directive("compareDate", CompareDate);

    CompareDate.$inject = [];

    function CompareDate() {
        var exports = {
            restrict: 'EA',
            templateUrl: 'app/shared/compare-date/compare-date.html',
            controller: "CompareDateController",
            controllerAs: "CompareDateCtrl",
            scope: {
                modalValue: '=',
                label: "=",
                fieldName: "=",
                isDisabled: "=",
                selectedOperator: "="
            },
            bindToController: true,
            link: Link
        };
        return exports;

        function Link(scope, ele, attr) {}
    }
})();
