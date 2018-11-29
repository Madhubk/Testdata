(function () {
    "use strict";

    angular
        .module("Application")
        .directive("orderLines", OrderLines);

    OrderLines.$inject = [];

    function OrderLines() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/purchase-order/order/order-lines/order-lines.html",
            link: Link,
            controller: "OrdLinesController",
            controllerAs: "OrdLinesCtrl",
            scope: {
                currentOrder: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();