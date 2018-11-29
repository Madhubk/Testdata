(function () {
    "use strict";

    angular
        .module("Application")
        .directive("myTaskDirective", MyTaskDirective)

    MyTaskDirective.$inject = [];

    function MyTaskDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-directive/my-task-directive.html",
            link: Link,
            controller: "MyTaskDirectiveController",
            controllerAs: "MyTaskDirectiveCtrl",
            bindToController: true,
            scope: {
                mode: "=",
                taskObj: "=",
                onComplete: "&",
                onRefreshStatusCount: "&",
                onRefreshTask: "&",
                editActivity: "&",
                assignStartCompleteResponse: "&"
            },
            link: Link,
        };
        return exports;

        function Link(scope, ele, attr) {}
    }

})();
