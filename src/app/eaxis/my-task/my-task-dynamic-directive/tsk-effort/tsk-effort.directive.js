(function () {
    "use strict";

    angular
        .module("Application")
        .directive("tskeffort", TaskEffortDirective);

    function TaskEffortDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/tsk-effort/tsk-effort.html",
            link: Link,
            controller: "TaskEffortDirectiveController",
            controllerAs: "TaskEffortDirectiveCtrl",
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
