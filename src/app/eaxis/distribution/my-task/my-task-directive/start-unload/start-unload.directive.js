(function () {
    "use strict";

    angular
        .module("Application")
        .directive("startunload", StartUnloadDirective)
        .directive("startunloadedit", StartUnloadEditDirective);

    function StartUnloadDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/my-task/my-task-directive/start-unload/start-unload.html",
            link: Link,
            controller: "StartUnloadDirectiveController",
            controllerAs: "StartUnloadCtrl",
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

    function StartUnloadEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/my-task/my-task-directive/start-unload/start-unload-edit.html",
            controller: "StartUnloadDirectiveController",
            controllerAs: "StartUnloadCtrl",
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
