(function () {
    "use strict";

    angular
        .module("Application")
        .directive("deliveryOrders", DeliveryOrders);

    DeliveryOrders.$inject = [];

    function DeliveryOrders() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/delivery-request/delivery-orders/delivery-orders.html",
            link: Link,
            controller: "DeliveryOrdersController",
            controllerAs: "DeliveryOrdersCtrl",
            scope: {
                currentDelivery: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();