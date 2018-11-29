(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneThreeOrderSplit", oneThreeOrderSplit);

    oneThreeOrderSplit.$inject = [];

    function oneThreeOrderSplit() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order/1_3_split/1_3_order-split.html",
            link: Link,
            controller: "one_three_OrdSplitController",
            controllerAs: "one_three_OrdSplitCtrl",
            scope: {
                currentOrder: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();