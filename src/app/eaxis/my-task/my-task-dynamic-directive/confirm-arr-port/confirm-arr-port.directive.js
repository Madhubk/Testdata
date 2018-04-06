(function () {
    "use strict";

    angular
        .module("Application")
        .directive("confirmarrport", ConfirmArrivalAtPortDirective);

    function ConfirmArrivalAtPortDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/confirm-arr-port/confirm-arr-port.html",
            link: Link,
            controller: "ConfirmArrivalAtPortDirectiveController",
            controllerAs: "ArrivalPortDirectiveCtrl",
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
