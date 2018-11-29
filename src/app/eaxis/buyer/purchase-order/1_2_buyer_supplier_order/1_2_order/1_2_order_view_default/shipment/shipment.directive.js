(function () {
    "use strict";

    angular
        .module("Application")
        .directive("orderViewDefaultShipment", OrderViewDefaultShipment);

    OrderViewDefaultShipment.$inject = [];

    function OrderViewDefaultShipment() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/1_2_buyer_supplier_order/1_2_order/1_2_order_view_default/shipment/shipment.html",
            controller: "OrderViewDefaultShipmentController",
            controllerAs: "OrderViewDefaultShipmentCtrl",
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