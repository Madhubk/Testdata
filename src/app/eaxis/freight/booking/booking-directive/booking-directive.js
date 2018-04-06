(function () {
    "use strict";

    angular
        .module("Application")
        .directive("bookingDirective", BookingDirective);

    BookingDirective.$inject = [];

    function BookingDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/booking/booking-directive/booking-directive.html",
            link: Link,
            controller: "BookingDirectiveController",
            controllerAs: "BookingDirectiveCtrl",
            scope: {
                currentBooking: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
