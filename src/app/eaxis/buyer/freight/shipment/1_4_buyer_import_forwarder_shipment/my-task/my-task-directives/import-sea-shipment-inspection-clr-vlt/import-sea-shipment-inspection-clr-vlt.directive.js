(function () {
    "use strict"
    angular
        .module("Application")
        .directive("bupvltcustominspection", BupVltCustomInspection)
        .directive("importSeaShipmentInspectionClrVlt", ImportSeaShipmentInspectionClrVlt);

    function BupVltCustomInspection() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/shipment/1_4_buyer_import_forwarder_shipment/my-task/my-task-directives/import-sea-shipment-inspection-clr-vlt/import-sea-shipment-inspection-clr-vlt-task-list.html",
            link: Link,
            controller: "ImportSeaShipmentCustomInspectionVltController",
            controllerAs: "ImportSeaShipmentCustomInspectionVltCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            }
        };

        return exports;
        function Link(scope, elem, attr) { }

    }        

    function ImportSeaShipmentInspectionClrVlt() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/shipment/1_4_buyer_import_forwarder_shipment/my-task/my-task-directives/import-sea-shipment-inspection-clr-vlt/import-sea-shipment-inspection-clr-vlt-activity.html",
            link: Link,
            controller: "ImportSeaShipmentCustomInspectionVltController",
            controllerAs: "ImportSeaShipmentCustomInspectionVltCtrl",
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
