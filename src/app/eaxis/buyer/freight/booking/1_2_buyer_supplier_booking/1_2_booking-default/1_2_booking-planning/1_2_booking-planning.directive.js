(function () {
    "use strict";

    angular
        .module("Application")
        .directive("bkgBuyerSupplierPlanning", bkgBuyerSupplierPlanning);

    bkgBuyerSupplierPlanning.$inject = [];

    function bkgBuyerSupplierPlanning() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/booking/1_2_buyer_supplier_booking/1_2_booking-default/1_2_booking-planning/1_2_booking-planning.html",
            link: Link,
            controller: "bkgBuyerSupplierPlanningController",
            controllerAs: "bkgBuyerSupplierPlanningCtrl",
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