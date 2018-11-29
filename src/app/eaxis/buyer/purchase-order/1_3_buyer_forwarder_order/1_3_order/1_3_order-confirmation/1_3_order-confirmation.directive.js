(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneThreeOrderConfirmDirective", oneThreeOrderConfirmDirective);

    oneThreeOrderConfirmDirective.$inject = [];

    function oneThreeOrderConfirmDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order/1_3_order-confirmation/1_3_order-confirmation.html",
            link: Link,
            controller: "one_three_OrderConfirmDirectiveController",
            controllerAs: "one_three_OrderConfirmDirectiveCtrl",
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