(function () {
    "use strict";

    angular
        .module("Application")
        .directive("bookingPickupAndDelivery", BookingPickupAndDelivery);

    BookingPickupAndDelivery.$inject = [];

    function BookingPickupAndDelivery() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/booking/pickup-and-delivery/pickup-and-delivery.html",
            link: Link,
            controller: "BookingPickupAndDeliveryController",
            controllerAs: "BookingPickupAndDeliveryCtrl",
            scope: {
                currentBooking: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
