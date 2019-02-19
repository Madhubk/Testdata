(function () {
    "use strict";

    angular
        .module("Application")
        .directive("icmactualpickup", icmactualpickup)
        .directive("icmActualPickupEdit", icmActualPickupEdit);

    function icmactualpickup() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/container/shared/my-task/my-task-directive/icm-actual-pickup/icm-actual-pickup-task-list.html",
            link: Link,
            controller: "IcmActualPickupController",
            controllerAs: "IcmActualPickupCtrl",
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

    function icmActualPickupEdit() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/container/shared/my-task/my-task-directive/icm-actual-pickup/icm-actual-pickup-activity.html",
            link: Link,
            controller: "IcmActualPickupController",
            controllerAs: "IcmActualPickupCtrl",
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