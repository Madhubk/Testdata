(function () {
    "use strict";

    angular
        .module("Application")
        .directive("bookingBranchDirective", BookingBranchDirective);

    BookingBranchDirective.$inject = [];

    function BookingBranchDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/booking-branch/booking-branch-directive/booking-branch-directive.html",
            link: Link,
            controller: "BookingBranchDirectiveController",
            controllerAs: "BookingBranchDirectiveCtrl",
            scope: {
                currentBooking: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();