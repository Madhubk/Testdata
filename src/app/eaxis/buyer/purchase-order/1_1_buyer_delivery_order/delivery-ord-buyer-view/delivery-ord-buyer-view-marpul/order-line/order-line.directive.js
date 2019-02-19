(function () {
    "use strict";

    angular
        .module("Application")
        .directive("deliveryOrdBuyerMarpulViewOrderLine", DeliveryOrdBuyerMarpulViewOrderLine);

    DeliveryOrdBuyerMarpulViewOrderLine.$inject = [];

    function DeliveryOrdBuyerMarpulViewOrderLine() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/order-shared/delivery-ord-buyer-read-only/delivery-ord-buyer-view/delivery-ord-buyer-view-marpul/order-line/order-line.html",
            controller: "DeliveryOrdBuyerMarpulViewOrderLineController",
            controllerAs: "DeliveryOrdBuyerMarpulViewOrderLineCtrl",
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