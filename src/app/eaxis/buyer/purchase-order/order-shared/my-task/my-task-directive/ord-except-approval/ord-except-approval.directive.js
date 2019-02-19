(function () {
    "use strict";

    angular
        .module("Application")
        .directive("ordexceptapproval", OrdExceptApprovalDirective);

    function OrdExceptApprovalDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/order-shared/my-task/my-task-directive/ord-except-approval/ord-except-approval.html",
            link: Link,
            controller: "OrdExceptApprovalDirectiveController",
            controllerAs: "OrdExceptApprovalDirectiveCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) {}
    }
})();