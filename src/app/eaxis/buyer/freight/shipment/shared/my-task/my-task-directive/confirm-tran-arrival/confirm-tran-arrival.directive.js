(function () {
    "use strict"
    angular
        .module("Application")
        .directive("confirmtranarrival", ConfirmTranArrival)
        .directive("confirmtranarrivaledit", ConfirmTranArrivalEdit)

    function ConfirmTranArrival() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/shipment/shared/my-task/my-task-directive/confirm-tran-arrival/confirm-tran-arrival-task-list.html",
            link: Link,
            controller: "ConfirmTranArrivalController",
            controllerAs: "ConfirmTranArrivalCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function ConfirmTranArrivalEdit() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/shipment/shared/my-task/my-task-directive/confirm-tran-arrival/confirm-tran-arrival-activity.html",
            link: Link,
            controller: "ConfirmTranArrivalController",
            controllerAs: "ConfirmTranArrivalCtrl",
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