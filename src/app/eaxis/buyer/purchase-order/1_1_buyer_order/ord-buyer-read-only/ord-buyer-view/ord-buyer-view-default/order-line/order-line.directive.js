(function () {
    "use strict";

    angular
        .module("Application")
        .directive("ordBuyerViewOrderLine", OrdBuyerViewOrderLine);

    OrdBuyerViewOrderLine.$inject = [];

    function OrdBuyerViewOrderLine() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/1_1_buyer_order/ord-buyer-read-only/ord-buyer-view/ord-buyer-view-default/order-line/order-line.html",
            controller: "OrdBuyerViewOrderLineController",
            controllerAs: "OrdBuyerViewOrderLineCtrl",
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