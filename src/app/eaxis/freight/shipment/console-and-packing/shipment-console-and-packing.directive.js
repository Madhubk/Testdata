(function () {
    "use strict";

    angular
        .module("Application")
        .directive("shipmentConsoleAndPacking", ShipmentConsoleAndPacking);

    ShipmentConsoleAndPacking.$inject = [];

    function ShipmentConsoleAndPacking() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/console-and-packing/shipment-console-and-packing.html",
            link: Link,
            controller: "ShipmentConsoleAndPackingController",
            controllerAs: "ShipmentConsolePackingCtrl",
            scope: {
                currentShipment: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
