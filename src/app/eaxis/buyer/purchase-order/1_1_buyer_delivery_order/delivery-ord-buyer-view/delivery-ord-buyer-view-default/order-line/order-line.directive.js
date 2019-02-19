(function () {
    "use strict";

    angular
        .module("Application")
        .directive("deliveryOrdBuyerViewOrderLine", DeliveryOrdBuyerViewOrderLine);

    DeliveryOrdBuyerViewOrderLine.$inject = [];

    function DeliveryOrdBuyerViewOrderLine() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/1_1_buyer_delivery_order/delivery-ord-buyer-view/delivery-ord-buyer-view-default/order-line/order-line.html",
            controller: "DeliveryOrdBuyerViewOrderLineController",
            controllerAs: "DeliveryOrdBuyerViewOrderLineCtrl",
            scope: {
                obj: "="
            },
            link: Link,
            bindToController: true
        };
        return exports;

        function Link(scope, ele, attr) {}
    }
})();