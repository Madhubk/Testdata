(function () {
    "use strict";

    angular
        .module("Application")
        .directive("approvalnotify", ApprovalNotifyDirective);

    function ApprovalNotifyDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/approval-notify/approval-notify.html",
            link: Link,
            controller: "ApprovalNotifyDirectiveController",
            controllerAs: "ApprovalNotifyDirectiveCtrl",
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
