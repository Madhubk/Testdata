(function () {
    "use strict"
    angular
        .module("Application")
        .directive("podreturnout", PodReturnOutDirective)
        .directive("podreturnoutEdit", PodReturnOutEditDirective);

    function PodReturnOutDirective() {
        var exports = {
            restrict: "EA",
            templateUrl:
                "app/eaxis/warehouse/my-task/my-task-directive/pod-return-out/pod-return-out-task-list.html",
            link: Link,
            controller: "PodReturnController",
            controllerAs: "PodReturnCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function PodReturnOutEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/my-task/my-task-directive/pod-return-out/pod-return-out-activity.html",
            link: Link,
            controller: "PodReturnController",
            controllerAs: "PodReturnCtrl",
            bindToController: true,
            scope: {
                currentObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }
})();
