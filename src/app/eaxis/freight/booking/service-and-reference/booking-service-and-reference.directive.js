(function () {
    "use strict";

    angular
        .module("Application")
        .directive("bookingServiceAndReference", BookingServiceAndReference);

    BookingServiceAndReference.$inject = [];

    function BookingServiceAndReference() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/booking/service-and-reference/booking-service-and-reference.html",
            link: Link,
            controller: "BookingServiceAndReferenceController",
            controllerAs: "BookingServiceAndReferenceCtrl",
            scope: {
                currentBooking: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
