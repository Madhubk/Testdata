(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneThreeShipmentBilling", oneThreeShipmentBilling);

    oneThreeShipmentBilling.$inject = [];

    function oneThreeShipmentBilling() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/shipment/1_3_buyer_forwarder_shipment/1_3_billing/1_3_shipment-billing.html",
            link: Link,
            controller: "oneThreeShipmentBillingController",
            controllerAs: "oneThreeShipmentBillingCtrl",
            scope: {
                currentShipment: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();