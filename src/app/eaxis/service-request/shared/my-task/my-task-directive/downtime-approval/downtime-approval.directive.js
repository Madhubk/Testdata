(function () {
    "use strict";

    angular
        .module("Application")
        .directive("downtimeapproval", DowntimeApprovalDirective);

    function DowntimeApprovalDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/service-request/shared/my-task/my-task-directive/downtime-approval/downtime-approval.html",
            link: Link,
            controller: "DowntimeApprovalDirectiveController",
            controllerAs: "DowntimeApprovalDirectiveCtrl",
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