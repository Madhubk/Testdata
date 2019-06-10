(function () {
    "use strict";

    angular
        .module("Application")
        .directive("dockout", DockOutDirective)
        .directive("dockoutedit", DockOutEditDirective);

    function DockOutDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/my-task/my-task-directive/dock-out/dock-out.html",
            link: Link,
            controller: "DockOutDirectiveController",
            controllerAs: "DockOutDirectiveCtrl",
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

    function DockOutEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/my-task/my-task-directive/dock-out/dock-out-edit.html",
            controller: "DockOutDirectiveController",
            controllerAs: "DockOutDirectiveCtrl",
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
