(function () {
    "use strict";

    angular
        .module("Application")
        .directive("ordapprovalnotifyedit", OrdApprovalNotifyEditDirective);

    OrdApprovalNotifyEditDirective.$inject = [];

    function OrdApprovalNotifyEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/order-shared/my-task/my-task-directive/ord-approval-notify/ord-approval-notify-edit/ord-approval-notify-edit.html",
            controller: "OrdApprovalNotifyEditDirectiveController",
            controllerAs: "OrdApprovalNotifyEditDirectiveCtrl",
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

        function Link(scope, ele, attr) { }
    }
})();
