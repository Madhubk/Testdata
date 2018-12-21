(function () {
    "use strict"
    angular
        .module("Application")
        .directive("cargoreceipt", CargoReceipt)
        .directive("exportSeaShipmentCargoReceiptGlb", ExportSeaShipmentCargoReceiptGlb);

    function CargoReceipt() {
        var exports = {
            restrict: "EA",
            templateUrl:
                "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-cargo-receipt-glb/export-sea-shipment-cargo-receipt-glb-task-list.html",
            link: Link,
            controller: "ExportSeaShipmentCargoReceiptGlbController",
            controllerAs: "ExportSeaShipmentCargoReceiptGlbCtrl",
            bindToController: true,
            scope: {
                taskObj: "=",
                onComplete: "&",
                getErrorWarningList: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function ExportSeaShipmentCargoReceiptGlb() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-cargo-receipt-glb/export-sea-shipment-cargo-receipt-glb-activity.html",
            link: Link,
            controller: "ExportSeaShipmentCargoReceiptGlbController",
            controllerAs: "ExportSeaShipmentCargoReceiptGlbCtrl",
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
