(function () {
    "use strict";

    angular
        .module("Application")
        .directive("prodSummary", ProdSummary);

    ProdSummary.$inject = [];

    function ProdSummary() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/purchase-order/order/prod-summary/prod-summary.html",
            link: Link,
            controller: "prodSummaryController",
            controllerAs: "prodSummaryCtrl",
            scope: {
                currentOrder: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();