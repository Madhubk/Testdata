(function () {
    "use strict";

    angular
        .module("Application")
        .directive("cycleCountJobs", cycleCountJobs);

    function cycleCountJobs() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/dynamic-dashboard/cycle-count-jobs/cycle-count-jobs.html",
            link: Link,
            controller: "CycleCountJobsController",
            controllerAs: "CycleCountJobsCtrl",
            scope: {
                componentList: "=",
                selectedComponent: "=",
                selectedWarehouse: "=",
                selectedClient: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();