(function () {
    "use strict";

    angular
        .module("Application")
        .directive("orderSplit", OrderSplit);

    OrderSplit.$inject = [];

    function OrderSplit() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/purchase-order/order/split/order-split.html",
            link: Link,
            controller: "OrdSplitController",
            controllerAs: "OrdSplitCtrl",
            scope: {
                currentOrder: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();