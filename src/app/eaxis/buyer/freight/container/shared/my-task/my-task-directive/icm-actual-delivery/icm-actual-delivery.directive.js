(function () {
    "use strict";

    angular
        .module("Application")
        .directive("icmactualdelivery", icmactualdelivery)
        .directive("icmActualDeliveryEdit", icmActualDeliveryEdit);

    function icmactualdelivery() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/container/shared/my-task/my-task-directive/icm-actual-delivery/icm-actual-delivery-task-list.html",
            link: Link,
            controller: "IcmActualDeliveryController",
            controllerAs: "IcmActualDeliveryCtrl",
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

    function icmActualDeliveryEdit() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/container/shared/my-task/my-task-directive/icm-actual-delivery/icm-actual-delivery-activity.html",
            link: Link,
            controller: "IcmActualDeliveryController",
            controllerAs: "IcmActualDeliveryCtrl",
            bindToController: true,
            scope: {
                taskObj: "=",
                onComplete: "&",
                onRefreshStatusCount: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) {}
    }
})();