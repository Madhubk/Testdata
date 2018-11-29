(function () {
    "use strict"
    angular
        .module("Application")
        .directive("confirmhbl", ConfirmHBL)
        .directive("exportSeaShipmentConfirmHblGlb", ExportSeaShipmentConfirmHBLGlb);

    function ConfirmHBL() {

        var exports = {
            restrict: "EA",
            templateUrl:
                "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-confirm-hbl-glb/export-sea-shipment-confirm-hbl-glb-task-list.html",
            link: Link,
            controller: "ExportSeaShipmentConfirmHBLGlbController",
            controllerAs: "ExportSeaShipmentConfirmHBLGlbCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }
    function ExportSeaShipmentConfirmHBLGlb() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-confirm-hbl-glb/export-sea-shipment-confirm-hbl-glb-activity.html",
            link: Link,
            controller: "ExportSeaShipmentConfirmHBLGlbController",
            controllerAs: "ExportSeaShipmentConfirmHBLGlbCtrl",
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
