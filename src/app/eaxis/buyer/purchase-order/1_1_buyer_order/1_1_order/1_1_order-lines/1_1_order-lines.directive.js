(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneOneOrderLines", oneOneOrderLines);

    oneOneOrderLines.$inject = [];

    function oneOneOrderLines() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_order-lines/1_1_order-lines.html",
            link: Link,
            controller: "one_one_OrdLinesController",
            controllerAs: "one_one_OrdLinesCtrl",
            scope: {
                currentOrder: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();