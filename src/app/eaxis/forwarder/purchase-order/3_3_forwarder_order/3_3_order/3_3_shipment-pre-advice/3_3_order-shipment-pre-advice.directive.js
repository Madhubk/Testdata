(function () {
    "use strict";

    angular
        .module("Application")
        .directive("threeThreeOrderShipmentPreAdvice", ThreeThreeOrderShipmentPreAdvice);

    ThreeThreeOrderShipmentPreAdvice.$inject = [];

    function ThreeThreeOrderShipmentPreAdvice() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_shipment-pre-advice/3_3_order-shipment-pre-advice.html",
            controller: "three_three_OrdShipmentPreAdviceController",
            controllerAs: "three_three_OrdShipmentPreAdviceCtrl",
            scope: {
                currentOrder: "="
            },
            link: Link,
            bindToController: true
        };
        return exports;

        function Link(scope, ele, attr) {}
    }
})();