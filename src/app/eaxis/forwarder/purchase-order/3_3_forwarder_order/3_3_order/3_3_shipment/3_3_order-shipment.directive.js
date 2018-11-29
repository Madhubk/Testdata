(function () {
    "use strict";

    angular
        .module("Application")
        .directive("threeThreeOrderShipment", ThreeThreeOrderShipment);

    ThreeThreeOrderShipment.$inject = [];

    function ThreeThreeOrderShipment() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_shipment/3_3_order-shipment.html",
            link: Link,
            controller: "three_three_OrderShipmentController",
            controllerAs: "three_three_OrderShipmentCtrl",
            scope: {
                currentOrder: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();