(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneOneOrderShipmentPreAdvice", oneOneOrderShipmentPreAdvice);

    oneOneOrderShipmentPreAdvice.$inject = [];

    function oneOneOrderShipmentPreAdvice() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_shipment-pre-advice/1_1_order-shipment-pre-advice.html",
            controller: "one_one_OrdShipmentPreAdviceController",
            controllerAs: "one_one_OrdShipmentPreAdviceCtrl",
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