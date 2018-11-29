(function () {
    "use strict";

    angular
        .module("Application")
        .directive("confirmmanarredit", ConfirmArrDepotEditDirective);

    ConfirmArrDepotEditDirective.$inject = [];

    function ConfirmArrDepotEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/transports/my-task/my-task-directive/confirm-man-arr/confirm-man-arr-edit/confirm-man-arr-edit.html",
            controller: "ConfirmArrDepotEditDirectiveController",
            controllerAs: "ArrivalDepotEditDirectiveCtrl",
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
