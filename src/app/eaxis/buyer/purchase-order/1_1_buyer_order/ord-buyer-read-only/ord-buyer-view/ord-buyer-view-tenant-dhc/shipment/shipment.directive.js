(function () {
    "use strict";

    angular
        .module("Application")
        .directive("ordBuyerViewShipmentDhc", OrdBuyerViewShipmentDhc);

    OrdBuyerViewShipmentDhc.$inject = [];

    function OrdBuyerViewShipmentDhc() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/1_1_buyer_order/ord-buyer-read-only/ord-buyer-view/ord-buyer-view-tenant-dhc/shipment/shipment.html",
            controller: "OrdBuyerViewShipmentDhcController",
            controllerAs: "OrdBuyerViewShipmentDhcCtrl",
            scope: {
                obj: "="
            },
            link: Link,
            bindToController: true
        };
        return exports;

        function Link(scope, ele, attr) {}
    }
})();