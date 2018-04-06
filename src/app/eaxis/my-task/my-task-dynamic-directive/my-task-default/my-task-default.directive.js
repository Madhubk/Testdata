(function () {
    "use strict";

    angular
        .module("Application")
        .directive("mytaskdefault", MyTaskDefaultDirective);

    function MyTaskDefaultDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/my-task-default/my-task-default.html",
            link: Link,
            controller: "MyTaskDefaultDirectiveController",
            controllerAs: "MyTaskDefaultDirectiveCtrl",
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
