(function () {
    "use strict";

    angular
        .module("Application")
        .directive("confirmcarrier", confirmcarrier)
        .directive("confirmCarrierEdit", confirmCarrierEdit);

    function confirmcarrier() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/confirm-carrier/confirm-carrier-task-list.html",
            link: Link,
            controller: "ConfirmCarrierController",
            controllerAs: "ConfirmCarrierCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) {}
    }

    function confirmCarrierEdit() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/confirm-carrier/confirm-carrier-activity.html",
            link: Link,
            controller: "ConfirmCarrierController",
            controllerAs: "ConfirmCarrierCtrl",
            bindToController: true,
            scope: {
                currentObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) {}
    }
})();