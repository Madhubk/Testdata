(function () {
    "use strict";

    angular
        .module("Application")
        .directive("shipmentOrder", ShipmentOrder);

        ShipmentOrder.$inject = [];

    function ShipmentOrder() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/shipment-order/shipment-order.html",
            link: Link,
            controller: "ShipmentOrderController",
            controllerAs: "ShipmentOrderCtrl",
            scope: {
                currentShipment: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
