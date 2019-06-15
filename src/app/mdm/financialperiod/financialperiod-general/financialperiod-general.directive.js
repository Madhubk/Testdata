(function () {
    "use strict";

    angular.module("Application")
        .directive("financialperiodGeneral", FinancialPeriodGeneral);

        FinancialPeriodGeneral.$inject = [];

    function FinancialPeriodGeneral() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/financialperiod/financialperiod-general/financialperiod-general.html",
            link: Link,
            controller: "FinancePeriodGeneralController",
            controllerAs: "FinancePeriodGeneralCtrl",
            scope: {
                currentFinancialperiod: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) { }
    }
})();