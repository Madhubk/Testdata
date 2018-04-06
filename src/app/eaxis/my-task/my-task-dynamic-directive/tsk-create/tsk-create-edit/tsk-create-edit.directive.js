(function () {
    "use strict";

    angular
        .module("Application")
        .directive("tskcreateedit", TaskCreateEditDirective);

    TaskCreateEditDirective.$inject = [];

    function TaskCreateEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/tsk-create/tsk-create-edit/tsk-create-edit.html",
            controller: "TaskCreateEditDirectiveController",
            controllerAs: "TaskCreateEditDirectiveCtrl",
            bindToController: true,
            link: Link,
            scope: {
                taskObj: "=",
                entityObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, ele, attr) {}
    }
})();
