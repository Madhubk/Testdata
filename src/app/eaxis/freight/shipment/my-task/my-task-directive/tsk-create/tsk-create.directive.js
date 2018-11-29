(function () {
    "use strict";

    angular
        .module("Application")
        .directive("tskcreate", TaskCreateDirective);

    function TaskCreateDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/tsk-create/tsk-create.html",
            link: Link,
            controller: "TaskCreateDirectiveController",
            controllerAs: "TaskCreateDirectiveCtrl",
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
