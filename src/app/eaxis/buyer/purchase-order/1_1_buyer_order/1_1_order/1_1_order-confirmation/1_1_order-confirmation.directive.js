(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneOneOrderConfirmDirective", oneOneOrderConfirmDirective);

    oneOneOrderConfirmDirective.$inject = [];

    function oneOneOrderConfirmDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_order-confirmation/1_1_order-confirmation.html",
            link: Link,
            controller: "one_one_OrderConfirmDirectiveController",
            controllerAs: "one_one_OrderConfirmDirectiveCtrl",
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