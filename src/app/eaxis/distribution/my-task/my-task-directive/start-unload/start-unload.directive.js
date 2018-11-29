(function () {
    "use strict";

    angular
        .module("Application")
        .directive("startunload", StartUnloadDirective);

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
                onComplete: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }
})();
