(function () {
    "use strict";

    angular.module("Application")
        .directive("financeJobGeneral", FinanceJobGeneral);

    FinanceJobGeneral.$inject = [];

    function FinanceJobGeneral() {
        var exports = {
            restrict: "E",
            templateUrl: "app/eaxis/finance/finance-job/finance-job-general/finance-job-general.html",
            controller: "FinanceJobGeneralController",
            controllerAs: "FinanceJobGeneralCtrl",
            link: Link,
            scope: {
                currentFinanceJob: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) { }
    }
})();