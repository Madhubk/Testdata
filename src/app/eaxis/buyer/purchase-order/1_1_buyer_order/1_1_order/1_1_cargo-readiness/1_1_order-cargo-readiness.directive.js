(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneOneOrderCargoReadiness", oneOneOrderCargoReadiness);

    oneOneOrderCargoReadiness.$inject = [];

    function oneOneOrderCargoReadiness() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_cargo-readiness/1_1_order-cargo-readiness.html",
            controller: "one_one_OrdCargoReadinessController",
            controllerAs: "one_one_OrdCargoReadinessCtrl",
            scope: {
                currentOrder: "="
            },
            link: Link,
            bindToController: true
        };
        return exports;

        function Link(scope, ele, attr) {}
    }
})();