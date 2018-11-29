(function () {
    "use strict";

    angular
        .module("Application")
        .directive("bookingcancellation", BookingCancellationDirective);

    function BookingCancellationDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/booking/my-task/my-task-directive/booking-cancellation/booking-cancellation/booking-cancellation.html",
            link: Link,
            controller: "BookingCancellationDirectiveController",
            controllerAs: "BookingCancellationDirectiveCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) {}
    }
})();
