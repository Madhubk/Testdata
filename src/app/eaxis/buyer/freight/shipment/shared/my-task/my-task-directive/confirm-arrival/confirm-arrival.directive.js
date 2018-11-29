(function () {
    "use strict"
    angular
        .module("Application")
        .directive("confirmarrival", ConfirmArrival)
        .directive("confirmarrivaledit", ConfirmArrivalEdit)

    function ConfirmArrival() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/shipment/shared/my-task/my-task-directive/confirm-arrival/confirm-arrival-task-list.html",
            link: Link,
            controller: "ConfirmArrivalController",
            controllerAs: "ConfirmArrivalCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function ConfirmArrivalEdit() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/shipment/shared/my-task/my-task-directive/confirm-arrival/confirm-arrival-activity.html",
            link: Link,
            controller: "ConfirmArrivalController",
            controllerAs: "ConfirmArrivalCtrl",
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