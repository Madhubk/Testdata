(function () {
    "use strict";

    angular
        .module("Application")
        .directive("orderActivation", OrderActivation);

    OrderActivation.$inject = [];

    function OrderActivation() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/purchase-order/order/order-tool-bar/order-activation-directive/order-activation.html",
            link: Link,
            controller: "OrderActivationController",
            controllerAs: "OrderActivationCtrl",
            scope: {
                input: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
    }

})();