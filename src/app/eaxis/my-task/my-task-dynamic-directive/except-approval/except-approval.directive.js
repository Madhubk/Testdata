(function () {
    "use strict";

    angular
        .module("Application")
        .directive("exceptapproval", ExceptApprovalDirective);

    function ExceptApprovalDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/except-approval/except-approval.html",
            link: Link,
            controller: "ExceptApprovalDirectiveController",
            controllerAs: "ExceptApprovalDirectiveCtrl",
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
