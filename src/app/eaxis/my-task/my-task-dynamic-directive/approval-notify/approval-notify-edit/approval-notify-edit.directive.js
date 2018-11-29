(function () {
    "use strict";

    angular
        .module("Application")
        .directive("approvalnotifyedit", ApprovalNotifyEditDirective);

    ApprovalNotifyEditDirective.$inject = [];

    function ApprovalNotifyEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/approval-notify/approval-notify-edit/approval-notify-edit.html",
            controller: "ApprovalNotifyEditDirectiveController",
            controllerAs: "ApprovalNotifyEditDirectiveCtrl",
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
