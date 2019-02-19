(function () {
    "use strict"
    angular
        .module("Application")
        .directive("bupvltchainvoice", BupVltChaInvoice);

    function BupVltChaInvoice() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/shipment/1_4_buyer_imp_frwd_shp/my-task/my-task-directives/import-sea-shipment-cha-inv-vlt/import-sea-shipment-cha-inv-vlt-task-list.html",
            link: Link,
            controller: "ImportSeaShipmentChaInvoiceVltController",
            controllerAs: "ImportSeaShipmentChaInvoiceVltCtrl",
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
        .directive("importSeaShipmentChaInvVlt", ImportSeaShipmentChaInvoiceVlt);

    function ImportSeaShipmentChaInvoiceVlt() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/shipment/1_4_buyer_imp_frwd_shp/my-task/my-task-directives/import-sea-shipment-cha-inv-vlt/import-sea-shipment-cha-inv-vlt-activity.html",
            link: Link,
            controller: "ImportSeaShipmentChaInvoiceVltController",
            controllerAs: "ImportSeaShipmentChaInvoiceVltCtrl",
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
