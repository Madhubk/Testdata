(function () {
    "use strict"
    angular
        .module("Application")
        .directive("confirmdeparture", ConfirmDeparture)
        .directive("exportSeaConsolConfirmDepartureGlb", ExportSeaConsolConfirmDepartureGlb)

    function ConfirmDeparture() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-confirm-departure-glb/export-sea-consol-confirm-departure-glb-task-list.html",
            link: Link,
            controller: "ExportSeaConsolConfirmDepartureGlbController",
            controllerAs: "ExportSeaConsolConfirmDepartureGlbCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function ExportSeaConsolConfirmDepartureGlb() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-confirm-departure-glb/export-sea-consol-confirm-departure-glb-activity.html",
            link: Link,
            controller: "ExportSeaConsolConfirmDepartureGlbController",
            controllerAs: "ExportSeaConsolConfirmDepartureGlbCtrl",
            bindToController: true,
            scope: {
                taskObj: "=",
                onComplete: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

})();