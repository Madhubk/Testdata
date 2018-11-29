(function () {
    "use strict";

    angular
        .module("Application")
        .directive("orderConfirmation", OrderConfirmation);

    OrderConfirmation.$inject = [];

    function OrderConfirmation() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/purchase-order/order/order-tool-bar/order-confirm-directive/order-confirmation.html",
            link: Link,
            controller: "OrderConfirmationController",
            controllerAs: "OrderConfirmationCtrl",
            scope: {
                input: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
    }

})();