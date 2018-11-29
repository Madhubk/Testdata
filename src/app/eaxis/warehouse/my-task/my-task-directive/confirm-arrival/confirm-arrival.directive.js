(function () {
    "use strict"
    angular
        .module("Application")
        .directive("inwconfirmarrival", ConfirmArrivalDirective)
        .directive("inwardConfirmArrivalEdit", ConfirmArrivalEditDirective);

    function ConfirmArrivalDirective() {
        var exports = {
            restrict: "EA",
            templateUrl:
                "app/eaxis/warehouse/my-task/my-task-directive/confirm-arrival/confirm-arrival-task-list.html",
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

    function ConfirmArrivalEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/my-task/my-task-directive/confirm-arrival/confirm-arrival-activity.html",
            link: Link,
            controller: "ConfirmArrivalController",
            controllerAs: "ConfirmArrivalCtrl",
            bindToController: true,
            scope: {
                currentObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }
})();
