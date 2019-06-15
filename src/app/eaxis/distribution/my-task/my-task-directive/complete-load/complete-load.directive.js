(function () {
    "use strict";

    angular
        .module("Application")
        .directive("completeload", CompleteLoadDirective)
        .directive("completeloadedit", CompleteLoadEditDirective);

    function CompleteLoadDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/my-task/my-task-directive/complete-load/complete-load.html",
            link: Link,
            controller: "CompleteLoadDirectiveController",
            controllerAs: "CompleteLoadCtrl",
            bindToController: true,
            scope: {
                taskObj: "=",
                onComplete: "&",
                getErrorWarningList: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function CompleteLoadEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/my-task/my-task-directive/complete-load/complete-load-edit.html",
            controller: "CompleteLoadDirectiveController",
            controllerAs: "CompleteLoadCtrl",
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

