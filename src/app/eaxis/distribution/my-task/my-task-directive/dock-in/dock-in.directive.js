(function () {
    "use strict";

    angular
        .module("Application")
        .directive("dockin", AllocateDockDirective)
        .directive("dockinedit", AllocateDockEditDirective);

    function AllocateDockDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/my-task/my-task-directive/dock-in/dock-in.html",
            link: Link,
            controller: "AllocateDockDirectiveController",
            controllerAs: "AllocateDockCtrl",
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

    function AllocateDockEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/my-task/my-task-directive/dock-in/dock-in-edit.html",
            controller: "AllocateDockDirectiveController",
            controllerAs: "AllocateDockCtrl",
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
