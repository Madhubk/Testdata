(function () {
    "use strict";

    angular
        .module("Application")
        .directive("quickbookapprovalnotifyedit", QuickBookApprovalNotifyEditDirective);

        QuickBookApprovalNotifyEditDirective.$inject = [];

    function QuickBookApprovalNotifyEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/booking/my-task/my-task-directive/quick-book-approval-notify/quick-book-approval-notify-edit/quick-book-approval-notify-edit.html",
            controller: "QuickBookApprovalNotifyEditDirectiveController",
            controllerAs: "QuickBookApprovalNotifyEditDirectiveCtrl",
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
