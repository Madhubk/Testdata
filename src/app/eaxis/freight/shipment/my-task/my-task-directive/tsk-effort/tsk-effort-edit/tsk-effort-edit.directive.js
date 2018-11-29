(function () {
    "use strict";

    angular
        .module("Application")
        .directive("tskeffortedit", TaskEffortEditDirective);

    TaskEffortEditDirective.$inject = [];

    function TaskEffortEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/tsk-effort/tsk-effort-edit/tsk-effort-edit.html",
            controller: "TaskEffortEditDirectiveController",
            controllerAs: "TaskEffortEditDirectiveCtrl",
            bindToController: true,
            link: Link,
            scope: {
                taskObj: "=",
                entityObj: "=",
                onComplete: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, ele, attr) {}
    }
})();
