(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneThreeShipmentOrder", oneThreeShipmentOrder);

    oneThreeShipmentOrder.$inject = [];

    function oneThreeShipmentOrder() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/shipment/1_3_buyer_forwarder_shipment/1_3_shipment-order/1_3_shipment-order.html",
            link: Link,
            controller: "oneThreeShipmentOrderController",
            controllerAs: "oneThreeShipmentOrderCtrl",
            scope: {
                currentShipment: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();