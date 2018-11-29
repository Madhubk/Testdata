(function () {
    "use strict";

    angular
        .module("Application")
        .directive("confirmmanarr", ConfirmArrivalAtDepotDirective);

    function ConfirmArrivalAtDepotDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/transports/my-task/my-task-directive/confirm-man-arr/confirm-man-arr.html",
            link: Link,
            controller: "ConfirmArrivalAtDepotDirectiveController",
            controllerAs: "ArrivalDepotDirectiveCtrl",
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
