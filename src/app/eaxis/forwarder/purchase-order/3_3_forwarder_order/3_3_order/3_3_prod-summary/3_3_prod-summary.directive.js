(function () {
    "use strict";

    angular
        .module("Application")
        .directive("threeThreeProdSummary", ThreeThreeProdSummary);

    ThreeThreeProdSummary.$inject = [];

    function ThreeThreeProdSummary() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_prod-summary/3_3_prod-summary.html",
            link: Link,
            controller: "three_three_ProdSummaryController",
            controllerAs: "three_three_ProdSummaryCtrl",
            scope: {
                currentOrder: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();