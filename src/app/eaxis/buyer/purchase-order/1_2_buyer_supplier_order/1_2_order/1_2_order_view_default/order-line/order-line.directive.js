(function () {
    "use strict";

    angular
        .module("Application")
        .directive("orderViewDefaultOrderLine", OrderViewDefaultOrderLine);

    OrderViewDefaultOrderLine.$inject = [];

    function OrderViewDefaultOrderLine() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/1_2_buyer_supplier_order/1_2_order/1_2_order_view_default/order-line/order-line.html",
            controller: "OrderViewDefaultOrdLineController",
            controllerAs: "OrderViewDefaultOrdLineCtrl",
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