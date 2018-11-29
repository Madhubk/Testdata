(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneThreeShipmentPickupAndDelivery", oneThreeShipmentPickupAndDelivery);

    oneThreeShipmentPickupAndDelivery.$inject = [];

    function oneThreeShipmentPickupAndDelivery() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/shipment/1_3_buyer_forwarder_shipment/1_3_pickup-and-delivery/1_3_pickup-and-delivery.html",
            link: Link,
            controller: "oneThreeShipmentPickupAndDeliveryController",
            controllerAs: "oneThreeShipmentPickupAndDeliveryCtrl",
            scope: {
                currentShipment: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();