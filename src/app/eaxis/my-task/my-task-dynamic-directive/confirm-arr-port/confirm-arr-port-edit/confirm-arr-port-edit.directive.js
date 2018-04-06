(function () {
    "use strict";

    angular
        .module("Application")
        .directive("confirmarrportedit", ConfirmArrPortEditDirective);

    ConfirmArrPortEditDirective.$inject = [];

    function ConfirmArrPortEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/my-task/my-task-dynamic-directive/confirm-arr-port/confirm-arr-port-edit/confirm-arr-port-edit.html",
            controller: "ConfirmArrPortEditDirectiveController",
            controllerAs: "ArrivalPortEditDirectiveCtrl",
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
