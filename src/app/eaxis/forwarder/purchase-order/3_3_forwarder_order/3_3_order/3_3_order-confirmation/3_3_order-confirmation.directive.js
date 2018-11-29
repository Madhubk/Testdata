(function () {
    "use strict";

    angular
        .module("Application")
        .directive("threeThreeOrderConfirmDirective", ThreeThreeOrderConfirmDirective);

    ThreeThreeOrderConfirmDirective.$inject = [];

    function ThreeThreeOrderConfirmDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_order-confirmation/3_3_order-confirmation.html",
            link: Link,
            controller: "three_three_OrderConfirmDirectiveController",
            controllerAs: "three_three_OrderConfirmDirectiveCtrl",
            scope: {
                list: "=",
                gridChange: "&",
                mode: "=",
                taskObj: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
    }

})();