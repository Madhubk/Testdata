(function () {
    "use strict";

    angular
        .module("Application")
        .directive("verifybooking", VerifyBookingDirective);

    function VerifyBookingDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/booking/my-task/my-task-directive/verify-booking/verify-booking.html",
            link: Link,
            controller: "VerifyBookingDirectiveController",
            controllerAs: "VerifyBookingDirectiveCtrl",
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
