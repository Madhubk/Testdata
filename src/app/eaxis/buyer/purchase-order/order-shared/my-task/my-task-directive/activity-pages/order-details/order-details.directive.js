(function () {
    "use strict";

    angular
        .module("Application")
        .directive("activityPageOrderDetails", ActivityPageOrderDetails);

    ActivityPageOrderDetails.$inject = [];

    function ActivityPageOrderDetails() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/order-shared/my-task/my-task-directive/activity-pages/order-details/order-details.html",
            controller: "ActivityPageOrderDetailsController",
            controllerAs: "ActivityPageOrderDetailsCtrl",
            scope: {
                obj: "="
            },
            link: Link,
            bindToController: true
        };
        return exports;

        function Link(scope, ele, attr) {}
    }
})();