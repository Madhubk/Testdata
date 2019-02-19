(function () {
    "use strict";

    angular
        .module("Application")
        .directive("ordapprovalnotify", OrdApprovalNotifyDirective);

    function OrdApprovalNotifyDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/order-shared/my-task/my-task-directive/ord-approval-notify/ord-approval-notify.html",
            link: Link,
            controller: "OrdApprovalNotifyDirectiveController",
            controllerAs: "OrdApprovalNotifyDirectiveCtrl",
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
