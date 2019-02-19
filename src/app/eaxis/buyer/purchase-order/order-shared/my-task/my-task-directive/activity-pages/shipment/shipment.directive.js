(function () {
    "use strict";

    angular
        .module("Application")
        .directive("activityPageOrderShipment", ActivityPageOrderShipment);

    ActivityPageOrderShipment.$inject = [];

    function ActivityPageOrderShipment() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/order-shared/my-task/my-task-directive/activity-pages/shipment/shipment.html",
            controller: "ActivityPageOrderShipmentController",
            controllerAs: "ActivityPageOrderShipmentCtrl",
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