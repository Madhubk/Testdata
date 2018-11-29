(function () {
    "use strict"
    angular
        .module("Application")
        .directive("confirmdeparture", ConfirmDeparture)
        .directive("confirmdepartureedit", ConfirmDepartureEdit)

    function ConfirmDeparture() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/shipment/shared/my-task/my-task-directive/confirm-departure/confirm-departure-task-list.html",
            link: Link,
            controller: "ConfirmDepartureController",
            controllerAs: "ConfirmDepartureCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function ConfirmDepartureEdit() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/shipment/shared/my-task/my-task-directive/confirm-departure/confirm-departure-activity.html",
            link: Link,
            controller: "ConfirmDepartureController",
            controllerAs: "ConfirmDepartureCtrl",
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