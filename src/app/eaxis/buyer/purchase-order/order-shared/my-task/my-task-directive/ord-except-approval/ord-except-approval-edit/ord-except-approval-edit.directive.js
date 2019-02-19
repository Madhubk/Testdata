(function () {
    "use strict";

    angular
        .module("Application")
        .directive("ordexceptapprovaledit", OrdExceptApprovalEditDirective);

    OrdExceptApprovalEditDirective.$inject = [];

    function OrdExceptApprovalEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/order-shared/my-task/my-task-directive/ord-except-approval/ord-except-approval-edit/ord-except-approval-edit.html",
            controller: "OrdExceptApprovalEditDirectiveController",
            controllerAs: "OrdExceptApprovalEditDirectiveCtrl",
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
