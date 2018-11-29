(function () {
    "use strict";

    angular
        .module("Application")
        .directive("threeThreeOrderLines", ThreeThreeOrderLines);

    ThreeThreeOrderLines.$inject = [];

    function ThreeThreeOrderLines() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_order-lines/3_3_order-lines.html",
            link: Link,
            controller: "three_three_OrdLinesController",
            controllerAs: "three_three_OrdLinesCtrl",
            scope: {
                currentOrder: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();