(function () {
    "use strict";

    angular
        .module("Application")
        .directive("dockin", AllocateDockDirective);

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
                onComplete: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }
})();
