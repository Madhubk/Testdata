(function () {
    "use strict";

    angular
        .module("Application")
        .directive("orderCargoReadiness", OrderCargoReadiness);

    OrderCargoReadiness.$inject = [];

    function OrderCargoReadiness() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/purchase-order/order/cargo-readiness/order-cargo-readiness.html",
            controller: "OrdCargoReadinessController",
            controllerAs: "OrdCargoReadinessCtrl",
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