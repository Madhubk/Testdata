(function () {
    "use strict"
    angular
        .module("Application")
        .directive("confirmtrandeparture", ConfirmTranDeparture)
        .directive("exportSeaConsolConfirmTranDepartureGlb", ExportSeaConsolConfirmTranDepartureGlb)

    function ConfirmTranDeparture() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-confirm-tran-departure-glb/export-sea-consol-confirm-tran-departure-glb-task-list.html",
            link: Link,
            controller: "ExportSeaConsolConfirmTranDepartGlbController",
            controllerAs: "ExportSeaConsolConfirmTranDepartGlbCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function ExportSeaConsolConfirmTranDepartureGlb() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/my-task/my-task-directive/export-sea-consol-confirm-tran-departure-glb/export-sea-consol-confirm-tran-departure-glb-activity.html",
            link: Link,
            controller: "ExportSeaConsolConfirmTranDepartGlbController",
            controllerAs: "ExportSeaConsolConfirmTranDepartGlbCtrl",
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