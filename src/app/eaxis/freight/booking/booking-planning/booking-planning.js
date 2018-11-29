(function () {
    "use strict";

    angular
        .module("Application")
        .directive("bookingPlanning", BookingPlanning);

    BookingPlanning.$inject = [];

    function BookingPlanning() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/booking/booking-planning/booking-planning.html",
            link: Link,
            controller: "BookingPlanningController",
            controllerAs: "BookingPlanningCtrl",
            scope: {
                currentBooking: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
