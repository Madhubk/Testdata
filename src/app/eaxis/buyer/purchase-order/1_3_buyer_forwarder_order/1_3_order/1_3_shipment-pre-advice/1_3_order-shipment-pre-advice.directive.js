(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneThreeOrderShipmentPreAdvice", oneThreeOrderShipmentPreAdvice);

    oneThreeOrderShipmentPreAdvice.$inject = [];

    function oneThreeOrderShipmentPreAdvice() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order/1_3_shipment-pre-advice/1_3_order-shipment-pre-advice.html",
            controller: "one_three_OrdShipmentPreAdviceController",
            controllerAs: "one_three_OrdShipmentPreAdviceCtrl",
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