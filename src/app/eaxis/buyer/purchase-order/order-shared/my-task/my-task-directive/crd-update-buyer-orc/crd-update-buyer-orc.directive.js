(function () {
    "use strict";

    angular
        .module("Application")
        .directive("crdupdatebuyerorc", CrdUpdateBuyerOrcDirective);

    function CrdUpdateBuyerOrcDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/order-shared/my-task/my-task-directive/crd-update-buyer-orc/crd-update-buyer-orc.html",
            link: Link,
            controller: "CrdUpdateBuyerOrcDirectiveController",
            controllerAs: "CrdUpdateBuyerOrcDirectiveCtrl",
            bindToController: true,
            scope: {
                taskObj: "=",
                onComplete: "&",
                onRefreshStatusCount: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) {}
    }
})();