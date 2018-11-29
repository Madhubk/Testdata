(function () {
    "use strict";

    angular
        .module("Application")
        .directive("ordconfirmbuyerorc", OrdConfirmBuyerOrcDirective);

    function OrdConfirmBuyerOrcDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/shared/my-task/my-task-directive/ord-confirm-buyer-orc/ord-confirm-buyer-orc.html",
            link: Link,
            controller: "OrdConfirmBuyerOrcDirectiveController",
            controllerAs: "OrdConfirmBuyerOrcDirectiveCtrl",
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