(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneThreeProdSummary", oneThreeProdSummary);

    oneThreeProdSummary.$inject = [];

    function oneThreeProdSummary() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order/1_3_prod-summary/1_3_prod-summary.html",
            link: Link,
            controller: "one_three_prodSummaryController",
            controllerAs: "one_three_prodSummaryCtrl",
            scope: {
                currentOrder: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();