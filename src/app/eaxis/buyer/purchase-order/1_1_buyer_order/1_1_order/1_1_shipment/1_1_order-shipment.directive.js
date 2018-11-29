(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneOneOrderShipment", oneOneOrderShipment);

    oneOneOrderShipment.$inject = [];

    function oneOneOrderShipment() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_shipment/1_1_order-shipment.html",
            link: Link,
            controller: "one_one_OrderShipmentController",
            controllerAs: "one_one_OrderShipmentCtrl",
            scope: {
                currentOrder: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();