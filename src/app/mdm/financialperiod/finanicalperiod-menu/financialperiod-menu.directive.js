(function () {
    "use strict";

    angular.module("Application")
        .directive("financialperiodMenu", FinancialPeriodMenu);

    FinancialPeriodMenu.$inject = [];

    function FinancialPeriodMenu() {
        debugger;
        var exports = {
            restrict: "E",
            templateUrl: "app/mdm/financialperiod/finanicalperiod-menu/financialperiod-menu.html",
            link: Link,
            controller: "FinancePeriodMenuController",
            controllerAs: "FinancePeriodMenuCtrl",
            scope: {
                currentFinancialperiod: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) { }
    }
})();