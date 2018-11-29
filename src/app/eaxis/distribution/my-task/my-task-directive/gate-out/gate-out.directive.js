(function () {
    "use strict";

    angular
        .module("Application")
        .directive("gateout", GateOutDirective);

    function GateOutDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/my-task/my-task-directive/gate-out/gate-out.html",
            link: Link,
            controller: "GateOutDirectiveController",
            controllerAs: "GateOutDirectiveCtrl",
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
