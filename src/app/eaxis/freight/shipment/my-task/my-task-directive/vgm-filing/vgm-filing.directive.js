(function () {
    "use strict"
    angular
        .module("Application")
        .directive("vgmfiling", VgmFiling)
        .directive("planvgmfiling", PlanVgmFiling);

    function VgmFiling() {
        var exports = {
            restrict: "EA",
            templateUrl: 
            "app/eaxis/freight/shipment/my-task/my-task-directive/vgm-filing/vgm-filing/vgm-filing.html",
            link: Link,
            controller: "VgmFilingController",
            controllerAs: "VgmFilingDirCtrl",
            bindToController: true,
            scope: {
                taskObj: "=" 
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function PlanVgmFiling() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/my-task/my-task-directive/vgm-filing/plan-vgm-filing/plan-vgm-filing.html",
            link: Link,
            controller: "PlanVgmFilingController",
            controllerAs: "PlanVgmFilingDirCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }
})();
