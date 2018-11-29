(function () {
    "use strict";

    angular
        .module("Application")
        .directive("quickbookapprovalnotify", QuickBookApprovalNotifyDirective);

    function QuickBookApprovalNotifyDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/booking/my-task/my-task-directive/quick-book-approval-notify/quick-book-approval-notify.html",
            link: Link,
            controller: "QuickBookApprovalNotifyDirectiveController",
            controllerAs: "QuickBookApprovalNotifyDirectiveCtrl",
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
