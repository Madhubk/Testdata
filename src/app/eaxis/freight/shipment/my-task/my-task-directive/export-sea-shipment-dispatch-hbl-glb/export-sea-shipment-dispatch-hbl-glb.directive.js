(function () {
    "use strict"
    angular
        .module("Application")
        .directive("dispatchhbl", DispatchHbl)
        .directive("exportSeaShipmentDispatchHblGlb", ExportSeaShipmentDispatchHblGlb);

    function DispatchHbl() {
        var exports = {
            restrict: "EA",
            templateUrl:"app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-dispatch-hbl-glb/export-sea-shipment-dispatch-hbl-glb-task-list.html",            
            link: Link,
            controller: "ExportSeaShipmentDispatchHBLGlbController",
            controllerAs: "ExportSeaShipmentDispatchHBLGlbCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }
    function ExportSeaShipmentDispatchHblGlb() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-dispatch-hbl-glb/export-sea-shipment-dispatch-hbl-glb-activity.html",
            link: Link,
            controller: "ExportSeaShipmentDispatchHBLGlbController",
            controllerAs: "ExportSeaShipmentDispatchHBLGlbCtrl",
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
