(function () {
    "use strict";

    angular
        .module("Application")
        .directive("ordConfirmBuyerOrcEdit", OrdConfirmBuyerOrcEditDirective);

    OrdConfirmBuyerOrcEditDirective.$inject = [];

    function OrdConfirmBuyerOrcEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/order-shared/my-task/my-task-directive/ord-confirm-buyer-orc/ord-confirm-buyer-orc-edit/ord-confirm-buyer-orc-edit.html",
            controller: "OrdConfirmBuyerOrcEditDirectiveController",
            controllerAs: "OrdConfirmBuyerOrcEditDirectiveCtrl",
            bindToController: true,
            link: Link,
            scope: {
                taskObj: "=",
                entityObj: "=",
                tabObj: "=",
                onComplete: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, ele, attr) {}
    }
})();