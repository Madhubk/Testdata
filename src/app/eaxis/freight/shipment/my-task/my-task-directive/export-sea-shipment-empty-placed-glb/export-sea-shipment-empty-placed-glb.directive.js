(function () {
    "use strict"
    angular
        .module("Application")
        .directive("emptyplaced", EmptyPlaced)
        .directive("exportSeaShipmentEmptyPlacedGlb", ExportSeaShipmentEmptyPlacedGlb);

    function EmptyPlaced() {
        var exports = {
            restrict: "EA",
            templateUrl:
                "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-empty-placed-glb/export-sea-shipment-empty-placed-glb-task-list.html",
            link: Link,
            controller: "exportSeaShipmentEmptyPlacedGlbController",
            controllerAs: "ExportSeaShipmentEmptyPlacedGlbCtrl",
            bindToController: true,
            scope: {
                taskObj: "=",
                onComplete : "&",
                getErrorWarningList:"&"
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function ExportSeaShipmentEmptyPlacedGlb() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-empty-placed-glb/export-sea-shipment-empty-placed-glb-activity.html",
            link: Link,
            controller: "exportSeaShipmentEmptyPlacedGlbController",
            controllerAs: "ExportSeaShipmentEmptyPlacedGlbCtrl",
            bindToController: true,
            scope: {
                currentObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }
})();
