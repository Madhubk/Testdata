(function () {
    "use strict"
    angular
        .module("Application")
        .directive("confirmtrandeparture", ConfirmTranDeparture)
        .directive("confirmtrandepartureedit", ConfirmTranDepartureEdit)

    function ConfirmTranDeparture() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/shipment/shared/my-task/my-task-directive/confirm-tran-departure/confirm-tran-departure-task-list.html",
            link: Link,
            controller: "ConfirmTranDepartController",
            controllerAs: "ConfirmTranDepartCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) {}
    }

    function ConfirmTranDepartureEdit() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/shipment/shared/my-task/my-task-directive/confirm-tran-departure/confirm-tran-departure-activity.html",
            link: Link,
            controller: "ConfirmTranDepartController",
            controllerAs: "ConfirmTranDepartCtrl",
            bindToController: true,
            scope: {
                taskObj: "=",
                onComplete: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) {}
    }

})();