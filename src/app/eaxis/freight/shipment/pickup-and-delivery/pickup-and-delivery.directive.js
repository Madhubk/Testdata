(function () {
    "use strict";

    angular
        .module("Application")
        .directive("shipmentPickupAndDelivery", ShipmentPickupAndDelivery);

    ShipmentPickupAndDelivery.$inject = [];

    function ShipmentPickupAndDelivery() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/pickup-and-delivery/pickup-and-delivery.html",
            link: Link,
            controller: "ShipmentPickupAndDeliveryController",
            controllerAs: "ShipmentPickupAndDeliveryCtrl",
            scope: {
                currentShipment: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
