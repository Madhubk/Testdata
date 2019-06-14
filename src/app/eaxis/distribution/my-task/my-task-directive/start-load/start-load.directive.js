(function () {
    "use strict";

    angular
        .module("Application")
        .directive("startload", StartLoadDirective)
        .directive("startloadedit", StartLoadEditDirective);

    function StartLoadDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/my-task/my-task-directive/start-load/start-load.html",
            link: Link,
            controller: "StartLoadDirectiveController",
            controllerAs: "StartLoadCtrl",
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

    function StartLoadEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/my-task/my-task-directive/start-load/start-load-edit.html",
            controller: "StartLoadDirectiveController",
            controllerAs: "StartLoadCtrl",
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
