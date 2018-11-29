(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneThreeOrderLines", oneThreeOrderLines);

    oneThreeOrderLines.$inject = [];

    function oneThreeOrderLines() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order/1_3_order-lines/1_3_order-lines.html",
            link: Link,
            controller: "one_three_OrdLinesController",
            controllerAs: "one_three_OrdLinesCtrl",
            scope: {
                currentOrder: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();