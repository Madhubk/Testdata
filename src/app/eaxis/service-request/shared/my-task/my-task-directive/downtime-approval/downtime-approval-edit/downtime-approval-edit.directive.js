(function () {
    "use strict";

    angular
        .module("Application")
        .directive("downtimeapprovaledit", DowntimeApprovalEditDirective);

    DowntimeApprovalEditDirective.$inject = [];

    function DowntimeApprovalEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/service-request/shared/my-task/my-task-directive/downtime-approval/downtime-approval-edit/downtime-approval-edit.html",
            controller: "DowntimeApprovalEditDirectiveController",
            controllerAs: "DowntimeApprovalEditDirectiveCtrl",
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
