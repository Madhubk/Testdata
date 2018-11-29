(function () {
    "use strict";

    angular
        .module("Application")
        .directive("orderConfirmDirective", OrderConfirmDirective);

    OrderConfirmDirective.$inject = [];

    function OrderConfirmDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/purchase-order/order/order-confirmation/order-confirmation.html",
            link: Link,
            controller: "OrderConfirmDirectiveController",
            controllerAs: "OrderConfirmDirectiveCtrl",
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