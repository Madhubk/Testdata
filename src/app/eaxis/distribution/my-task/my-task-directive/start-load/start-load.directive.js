(function () {
    "use strict";

    angular
        .module("Application")
        .directive("startload", StartLoadDirective);

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
                onComplete: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }
})();
