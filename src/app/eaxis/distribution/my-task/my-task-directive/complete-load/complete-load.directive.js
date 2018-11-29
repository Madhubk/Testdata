(function () {
    "use strict";

    angular
        .module("Application")
        .directive("completeload", CompleteLoadDirective);

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
                onComplete: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }
})();
