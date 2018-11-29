(function () {
    "use strict";

    angular
        .module("Application")
        .directive("orderShipment", OrderShipment);

    OrderShipment.$inject = [];

    function OrderShipment() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/purchase-order/order/shipment/order-shipment.html",
            link: Link,
            controller: "OrderShipmentController",
            controllerAs: "OrderShipmentCtrl",
            scope: {
                currentOrder: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();