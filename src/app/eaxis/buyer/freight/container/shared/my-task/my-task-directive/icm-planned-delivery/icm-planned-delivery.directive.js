(function () {
    "use strict";

    angular
        .module("Application")
        .directive("icmplanneddelivery", icmplanneddelivery)
        .directive("icmPlannedDeliveryEdit", icmPlannedDeliveryEdit);

    function icmplanneddelivery() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/container/shared/my-task/my-task-directive/icm-planned-delivery/icm-planned-delivery-task-list.html",
            link: Link,
            controller: "IcmPlannedDeliveryController",
            controllerAs: "IcmPlannedDeliveryCtrl",
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

    function icmPlannedDeliveryEdit() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/container/shared/my-task/my-task-directive/icm-planned-delivery/icm-planned-delivery-activity.html",
            link: Link,
            controller: "IcmPlannedDeliveryController",
            controllerAs: "IcmPlannedDeliveryCtrl",
            bindToController: true,
            scope: {
                onComplete: "&",
                taskObj: "=",
                onRefreshStatusCount: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) {}
    }
})();