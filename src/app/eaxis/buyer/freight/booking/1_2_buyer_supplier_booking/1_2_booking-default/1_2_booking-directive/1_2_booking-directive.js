(function () {
    "use strict";

    angular
        .module("Application")
        .directive("bkgBuyerSupplierDirective", bkgBuyerSupplierDirective);

    bkgBuyerSupplierDirective.$inject = [];

    function bkgBuyerSupplierDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/booking/1_2_buyer_supplier_booking/1_2_booking-default/1_2_booking-directive/1_2_booking-directive.html",
            link: Link,
            controller: "bkgBuyerSupplierDirectiveController",
            controllerAs: "bkgBuyerSupplierDirectiveCtrl",
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