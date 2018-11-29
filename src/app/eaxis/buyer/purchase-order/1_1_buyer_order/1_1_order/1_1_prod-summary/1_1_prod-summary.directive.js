(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneOneProdSummary", oneOneProdSummary);

    oneOneProdSummary.$inject = [];

    function oneOneProdSummary() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_prod-summary/1_1_prod-summary.html",
            link: Link,
            controller: "one_one_prodSummaryController",
            controllerAs: "one_one_prodSummaryCtrl",
            scope: {
                currentOrder: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();