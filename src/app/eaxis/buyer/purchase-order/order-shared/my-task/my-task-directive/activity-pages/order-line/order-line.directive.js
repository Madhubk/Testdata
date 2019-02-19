(function () {
    "use strict";

    angular
        .module("Application")
        .directive("activityPageOrderLine", ActivityPageOrderLine);

    ActivityPageOrderLine.$inject = [];

    function ActivityPageOrderLine() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/order-shared/my-task/my-task-directive/activity-pages/order-line/order-line.html",
            controller: "ActivityPageOrderLineController",
            controllerAs: "ActivityPageOrderLineCtrl",
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