(function () {
    "use strict"
    angular
        .module("Application")
        .directive("confirmdelivery", ConfirmDeliveryDirective)
        .directive("confirmDeliveryEdit", ConfirmDeliveryEditDirective);

    function ConfirmDeliveryDirective() {
        var exports = {
            restrict: "EA",
            templateUrl:
                "app/eaxis/warehouse/my-task/my-task-directive/confirm-delivery/confirm-delivery-task-list.html",
            link: Link,
            controller: "ConfirmDeliveryController",
            controllerAs: "ConfirmDeliveryCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function ConfirmDeliveryEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/my-task/my-task-directive/confirm-delivery/confirm-delivery-activity.html",
            link: Link,
            controller: "ConfirmDeliveryController",
            controllerAs: "ConfirmDeliveryCtrl",
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
