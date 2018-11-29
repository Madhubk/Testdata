(function () {
    "use strict";

    angular
        .module("Application")
        .directive("threeThreeOrderSplit", ThreeThreeOrderSplit);

    ThreeThreeOrderSplit.$inject = [];

    function ThreeThreeOrderSplit() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_split/3_3_order-split.html",
            link: Link,
            controller: "three_three_OrdSplitController",
            controllerAs: "three_three_OrdSplitCtrl",
            scope: {
                currentOrder: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();