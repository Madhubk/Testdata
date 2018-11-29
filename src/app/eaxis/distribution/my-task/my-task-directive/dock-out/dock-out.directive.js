(function () {
    "use strict";

    angular
        .module("Application")
        .directive("dockout", DockOutDirective);

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
                onComplete: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }
})();
