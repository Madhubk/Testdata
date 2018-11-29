(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneOneOrderSplit", oneOneOrderSplit);

    oneOneOrderSplit.$inject = [];

    function oneOneOrderSplit() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_split/1_1_order-split.html",
            link: Link,
            controller: "one_one_OrdSplitController",
            controllerAs: "one_one_OrdSplitCtrl",
            scope: {
                currentOrder: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();