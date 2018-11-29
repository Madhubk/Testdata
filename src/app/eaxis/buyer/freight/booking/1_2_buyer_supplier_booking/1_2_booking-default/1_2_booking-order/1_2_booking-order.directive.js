(function () {
    "use strict";

    angular
        .module("Application")
        .directive("bkgBuyerSupplierOrder", bkgBuyerSupplierOrder);

    bkgBuyerSupplierOrder.$inject = [];

    function bkgBuyerSupplierOrder() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/booking/1_2_buyer_supplier_booking/1_2_booking-default/1_2_booking-order/1_2_booking-order.html",
            link: Link,
            controller: "bkgBuyerSupplierOrderController",
            controllerAs: "bkgBuyerSupplierOrderCtrl",
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