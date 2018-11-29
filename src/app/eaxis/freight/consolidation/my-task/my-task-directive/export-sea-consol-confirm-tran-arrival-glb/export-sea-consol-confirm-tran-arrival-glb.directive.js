(function () {
    "use strict"
    angular
        .module("Application")
        .directive("confirmtranarrival", ConfirmTranArrival)
        .directive("exportSeaConsolConfirmTranArrivalGlb", ExportSeaConsolConfirmTranArrivalGlb)

    function ConfirmTranArrival() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-confirm-tran-arrival-glb/export-sea-consol-confirm-tran-arrival-glb-task-list.html",
            link: Link,
            controller: "ExportSeaConsolConfirmTranArrivalGlbController",
            controllerAs: "ExportSeaConsolConfirmTranArrivalGlbCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function ExportSeaConsolConfirmTranArrivalGlb() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-confirm-tran-arrival-glb/export-sea-consol-confirm-tran-arrival-glb-activity.html",
            link: Link,
            controller: "ExportSeaConsolConfirmTranArrivalGlbController",
            controllerAs: "ExportSeaConsolConfirmTranArrivalGlbCtrl",
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