(function () {
    "use strict";

    angular.module("Application")
        .directive("jobAccounting", JobAccounting);

    JobAccounting.$inject = [];

    function JobAccounting() {
        var exports = {
            restrict: "E",
            templateUrl: "app/eaxis/finance/shared/job-accounting/job-accounting.html",
            controller: "JobAccountingController",
            controllerAs: "JobAccountingCtrl",
            scope: {
                currentFinanceJob: "=",
            },
            bindToController: true
        };
        return exports;
    }

})();