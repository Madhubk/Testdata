(function () {
    "use strict"
    angular
        .module("Application")
        .directive("preparehbl", PrepareHBL)
        .directive("exportSeaShipmentPrepareHblGlb", ExportSeaShipmentPrepareHBLGlb);

    function PrepareHBL() {
        var exports = {
            restrict: "EA",
            templateUrl:"app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-prepare-hbl-glb/export-sea-shipment-prepare-hbl-glb-task-list.html",            
            link: Link,
            controller: "ExportSeaShipmentPrepareHBLGlbController",
            controllerAs: "ExportSeaShipmentPrepareHBLGlbCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }
    function ExportSeaShipmentPrepareHBLGlb() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-prepare-hbl-glb/export-sea-shipment-prepare-hbl-glb-activity.html",
            link: Link,
            controller: "ExportSeaShipmentPrepareHBLGlbController",
            controllerAs: "ExportSeaShipmentPrepareHBLGlbCtrl",
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
