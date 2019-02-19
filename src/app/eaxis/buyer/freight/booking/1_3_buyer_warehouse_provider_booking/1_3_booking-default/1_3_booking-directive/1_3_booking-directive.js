(function () {
    "use strict";

    angular
        .module("Application")
        .directive("bkgBuyerWarehouseProviderDirective", bkgBuyerWarehouseProviderDirective);

    bkgBuyerWarehouseProviderDirective.$inject = [];

    function bkgBuyerWarehouseProviderDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/booking/1_3_buyer_warehouse_provider_booking/1_3_booking-default/1_3_booking-directive/1_3_booking-directive.html",
            link: Link,
            controller: "bkgBuyerWarehouseProviderDirectiveController",
            controllerAs: "bkgBuyerWarehouseProviderDirectiveCtrl",
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