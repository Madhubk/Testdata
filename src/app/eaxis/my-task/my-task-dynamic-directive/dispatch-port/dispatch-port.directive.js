(function () {
    "use strict";

    angular
        .module("Application")
        .directive("dispatchport", DispatchPortDirective);

    function DispatchPortDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/dispatch-port/dispatch-port.html",
            link: Link,
            controller: "DispatchPortDirectiveController",
            controllerAs: "DispatchPortDirectiveCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) {}
    }
})();
