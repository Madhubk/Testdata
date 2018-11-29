(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneThreeShipmentConsoleAndPacking", oneThreeShipmentConsoleAndPacking);

    oneThreeShipmentConsoleAndPacking.$inject = [];

    function oneThreeShipmentConsoleAndPacking() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/shipment/1_3_buyer_forwarder_shipment/1_3_console-and-packing/1_3_shipment-console-and-packing.html",
            link: Link,
            controller: "oneThreeShipmentConsoleAndPackingController",
            controllerAs: "oneThreeShipmentConsoleAndPackingCtrl",
            scope: {
                currentShipment: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();