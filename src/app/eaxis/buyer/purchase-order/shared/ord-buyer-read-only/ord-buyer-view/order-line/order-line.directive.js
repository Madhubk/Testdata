(function () {
    "use strict";

    angular
        .module("Application")
        .directive("ordBuyerViewOrderLine", OrdBuyerViewOrderLine);

    OrdBuyerViewOrderLine.$inject = [];

    function OrdBuyerViewOrderLine() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/shared/ord-buyer-read-only/ord-buyer-view/order-line/order-line.html",
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