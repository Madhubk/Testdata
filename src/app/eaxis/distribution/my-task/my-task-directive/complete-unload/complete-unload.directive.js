(function () {
    "use strict";

    angular
        .module("Application")
        .directive("completeunload", CompleteUnloadDirective)
        .directive("completeunloadedit", CompleteUnloadEditDirective);

    function CompleteUnloadDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/my-task/my-task-directive/complete-unload/complete-unload.html",
            link: Link,
            controller: "CompleteUnloadDirectiveController",
            controllerAs: "CompleteUnloadCtrl",
            bindToController: true,
            scope: {
                taskObj: "=",
                onComplete: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function CompleteUnloadEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/my-task/my-task-directive/complete-unload/complete-unload-edit.html",
            link: Link,
            controller: "CompleteUnloadDirectiveController",
            controllerAs: "CompleteUnloadCtrl",
            bindToController: true,
            scope: {
                taskObj: "=",
                onComplete: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }
})();
