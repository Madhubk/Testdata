(function () {
    "use strict"
    angular
        .module("Application")
        .directive("hblclarification", HBLClarification)
        .directive("exportSeaShipmentHblClarificationGlb", ExportSeaShipmentHBLClarificationGlb);

    function HBLClarification() {
        var exports = {
            restrict: "EA",
            templateUrl:"app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-hbl-clarification-glb/export-sea-shipment-hbl-clarification-glb-task-list.html",            
            link: Link,
            controller: "ExportSeaShipmentHBLClarificationGlbController",
            controllerAs: "ExportSeaShipmentHBLClarificationGlbCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }
    function ExportSeaShipmentHBLClarificationGlb() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-hbl-clarification-glb/export-sea-shipment-hbl-clarification-glb-activity.html",
            link: Link,
            controller: "ExportSeaShipmentHBLClarificationGlbController",
            controllerAs: "ExportSeaShipmentHBLClarificationGlbCtrl",
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
