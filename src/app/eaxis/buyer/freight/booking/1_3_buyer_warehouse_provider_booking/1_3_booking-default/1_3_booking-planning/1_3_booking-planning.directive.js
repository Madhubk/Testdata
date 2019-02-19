(function () {
    "use strict";

    angular
        .module("Application")
        .directive("bkgBuyerWarehouseProviderPlanning", bkgBuyerWarehouseProviderPlanning);

    bkgBuyerWarehouseProviderPlanning.$inject = [];

    function bkgBuyerWarehouseProviderPlanning() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/booking/1_3_buyer_warehouse_provider_booking/1_3_booking-default/1_3_booking-planning/1_3_booking-planning.html",
            link: Link,
            controller: "bkgBuyerWarehouseProviderPlanningController",
            controllerAs: "bkgBuyerWarehouseProviderPlanningCtrl",
            scope: {
                currentBooking: "=?currentBooking",
                obj: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();