(function () {
    "use strict";

    angular
        .module("Application")
        .directive("exceptapprovaledit", ExceptApprovalEditDirective);

    ExceptApprovalEditDirective.$inject = [];

    function ExceptApprovalEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/except-approval/except-approval-edit/except-approval-edit.html",
            controller: "ExceptApprovalEditDirectiveController",
            controllerAs: "ExceptApprovalEditDirectiveCtrl",
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
