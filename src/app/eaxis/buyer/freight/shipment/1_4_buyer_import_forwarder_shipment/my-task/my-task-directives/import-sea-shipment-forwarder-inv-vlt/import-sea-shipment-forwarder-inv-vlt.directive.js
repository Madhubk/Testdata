(function () {
    "use strict"
    angular
        .module("Application")
        .directive("bupvltforwarderinvoice", BupVltForwarderInvoice);

    function BupVltForwarderInvoice() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/shipment/1_4_buyer_import_forwarder_shipment/my-task/my-task-directives/import-sea-shipment-forwarder-inv-vlt/import-sea-shipment-forwarder-inv-vlt-task-list.html",
            link: Link,
            controller: "ImportSeaShipmentForwarderInvoiceVltController",
            controllerAs: "ImportSeaShipmentForwarderInvoiceVltCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            }
        };

        return exports;
        function Link(scope, elem, attr) { }

    }

    angular
        .module("Application")
        .directive("importSeaShipmentForwarderInvVlt", ImportSeaShipmentForwarderInvoiceVlt);

    function ImportSeaShipmentForwarderInvoiceVlt() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/shipment/1_4_buyer_import_forwarder_shipment/my-task/my-task-directives/import-sea-shipment-forwarder-inv-vlt/import-sea-shipment-forwarder-inv-vlt-activity.html",
            link: Link,
            controller: "ImportSeaShipmentForwarderInvoiceVltController",
            controllerAs: "ImportSeaShipmentForwarderInvoiceVltCtrl",
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
