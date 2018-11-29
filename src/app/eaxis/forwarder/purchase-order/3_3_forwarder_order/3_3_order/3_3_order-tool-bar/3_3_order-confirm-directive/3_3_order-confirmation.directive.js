(function () {
    "use strict";

    angular
        .module("Application")
        .directive("threeThreeOrderConfirmation", ThreeThreeOrderConfirmation);

    ThreeThreeOrderConfirmation.$inject = [];

    function ThreeThreeOrderConfirmation() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_order-tool-bar/3_3_order-confirm-directive/3_3_order-confirmation.html",
            link: Link,
            controller: "three_three_OrderConfirmationController",
            controllerAs: "three_three_OrderConfirmationCtrl",
            scope: {
                input: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
    }

})();