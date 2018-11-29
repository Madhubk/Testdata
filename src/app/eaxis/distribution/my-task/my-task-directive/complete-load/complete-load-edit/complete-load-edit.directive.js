(function () {
    "use strict";

    angular
        .module("Application")
        .directive("completeloadedit", CompleteLoadEditDirective);

    CompleteLoadEditDirective.$inject = [];

    function CompleteLoadEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/my-task/my-task-directive/complete-load/complete-load-edit/complete-load-edit.html",
            controller: "CompleteLoadEditDirectiveController",
            controllerAs: "CompleteLoadEditCtrl",
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
