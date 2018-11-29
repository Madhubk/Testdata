(function () {
    "use strict";

    angular
        .module("Application")
        .directive("bookingSupplierDirective", BookingSupplierDirective);

    BookingSupplierDirective.$inject = [];

    function BookingSupplierDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/booking-supplier/booking-supplier-directive/booking-supplier-directive.html",
            link: Link,
            controller: "BookingSupplierDirectiveController",
            controllerAs: "BookingSupplierDirectiveCtrl",
            scope: {
                currentBooking: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();