(function () {
    "use strict";

    angular
        .module("Application")
        .directive("bookingOrder", BookingOrder);

        BookingOrder.$inject = [];

    function BookingOrder() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/booking/booking-order/booking-order.html",
            link: Link,
            controller: "BookingOrderController",
            controllerAs: "BookingOrderCtrl",
            scope: {
                currentBooking: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
