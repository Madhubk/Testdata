(function () {
    "use strict"
    angular
        .module("Application")
        .directive("confirmarrival", ConfirmArrival)
        .directive("exportSeaConsolConfirmArrivalGlb", ExportSeaConsolConfirmArrivalGlb)

    function ConfirmArrival() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-confirm-arrival-glb/export-sea-consol-confirm-arrival-glb-task-list.html",
            link: Link,
            controller: "ExportSeaConsolConfirmArrivalGlbController",
            controllerAs: "ExportSeaConsolConfirmArrivalGlbCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function ExportSeaConsolConfirmArrivalGlb() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-confirm-arrival-glb/export-sea-consol-confirm-arrival-glb-activity.html",
            link: Link,
            controller: "ExportSeaConsolConfirmArrivalGlbController",
            controllerAs: "ExportSeaConsolConfirmArrivalGlbCtrl",
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