(function () {
    "use strict";

    angular
        .module("Application")
        .directive("shipmentBilling", ShipmentBilling);

    ShipmentBilling.$inject = [];

    function ShipmentBilling() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/billing/shipment-billing.html",
            link: Link,
            controller: "ShipmentBillingController",
            controllerAs: "ShipmentBillingCtrl",
            scope: {
                currentShipment: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
