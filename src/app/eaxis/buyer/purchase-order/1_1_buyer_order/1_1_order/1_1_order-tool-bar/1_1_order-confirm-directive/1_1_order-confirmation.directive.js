(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneOneOrderConfirmation", oneOneOrderConfirmation);

    oneOneOrderConfirmation.$inject = [];

    function oneOneOrderConfirmation() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_order-tool-bar/1_1_order-confirm-directive/1_1_order-confirmation.html",
            link: Link,
            controller: "one_one_OrderConfirmationController",
            controllerAs: "one_one_OrderConfirmationCtrl",
            scope: {
                input: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
    }

})();