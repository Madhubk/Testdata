(function () {
    "use strict";

    angular
        .module("Application")
        .directive("orderLinesDirective", OrderLinesDirective);

    OrderLinesDirective.$inject = [];

    function OrderLinesDirective() {
        var exports = {
            restrict: "E",
            templateUrl: "app/eaxis/purchase-order/order-lines/order-lines-directive/order-lines.directive.html",
            link: Link,
            controller: "OrderLinesDirectiveController",
            controllerAs: "OrderLinesDirectiveCtrl",
            scope: {
                currentOrderLines: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();