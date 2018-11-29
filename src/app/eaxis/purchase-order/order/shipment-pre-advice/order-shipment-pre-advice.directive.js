(function () {
    "use strict";

    angular
        .module("Application")
        .directive("orderShipmentPreAdvice", OrderShipmentPreAdvice);

    OrderShipmentPreAdvice.$inject = [];

    function OrderShipmentPreAdvice() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/purchase-order/order/shipment-pre-advice/order-shipment-pre-advice.html",
            controller: "OrdShipmentPreAdviceController",
            controllerAs: "OrdShipmentPreAdviceCtrl",
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