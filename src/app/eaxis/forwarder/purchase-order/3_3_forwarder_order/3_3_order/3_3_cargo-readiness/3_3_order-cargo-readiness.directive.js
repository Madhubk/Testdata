(function () {
    "use strict";

    angular
        .module("Application")
        .directive("threeThreeOrderCargoReadiness", ThreeThreeOrderCargoReadiness);

    ThreeThreeOrderCargoReadiness.$inject = [];

    function ThreeThreeOrderCargoReadiness() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_cargo-readiness/3_3_order-cargo-readiness.html",
            controller: "three_three_OrdCargoReadinessController",
            controllerAs: "three_three_OrdCargoReadinessCtrl",
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