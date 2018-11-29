(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneThreeOrderShipment", oneThreeOrderShipment);

    oneThreeOrderShipment.$inject = [];

    function oneThreeOrderShipment() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order/1_3_shipment/1_3_order-shipment.html",
            link: Link,
            controller: "one_three_OrderShipmentController",
            controllerAs: "one_three_OrderShipmentCtrl",
            scope: {
                currentOrder: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();