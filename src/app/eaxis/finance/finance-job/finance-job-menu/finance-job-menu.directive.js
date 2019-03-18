(function () {
    "use strict";

    angular.module("Application")
        .directive("financeJobMenu", FinanceJobMenu);

    FinanceJobMenu.$inject = [];

    function FinanceJobMenu() {
        var exports = {
            restrict: "E",
            templateUrl: "app/eaxis/finance/finance-job/finance-job-menu/finance-job-menu.html",
            controller: "FinanceJobMenuController",
            controllerAs: "FinanceJobMenuCtrl",
            link: Link,
            scope: {
                currentFinanceJob: "=",
               /*  dataentryObject: "=" */
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) { }
    }

})();