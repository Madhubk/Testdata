(function () {
    "use strict";

    angular
        .module("Application")
        .directive("pickupOrders", PickupOrders);

    PickupOrders.$inject = [];

    function PickupOrders() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/pickup-request/pickup-orders/pickup-orders.html",
            link: Link,
            controller: "PickupOrdersController",
            controllerAs: "PickupOrdersCtrl",
            scope: {
                currentPickup: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();