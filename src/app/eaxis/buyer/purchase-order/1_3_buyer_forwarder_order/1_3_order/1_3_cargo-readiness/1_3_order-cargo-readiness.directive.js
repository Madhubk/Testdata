(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneThreeOrderCargoReadiness", oneThreeOrderCargoReadiness);

    oneThreeOrderCargoReadiness.$inject = [];

    function oneThreeOrderCargoReadiness() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order/1_3_cargo-readiness/1_3_order-cargo-readiness.html",
            controller: "one_three_OrdCargoReadinessController",
            controllerAs: "one_three_OrdCargoReadinessCtrl",
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