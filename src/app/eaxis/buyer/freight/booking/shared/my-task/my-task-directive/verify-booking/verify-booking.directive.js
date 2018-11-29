(function () {
    "use strict";

    angular
        .module("Application")
        .directive("verifybooking", verifybooking)
        .directive("verifyBookingEdit", verifyBookingEdit);

    function verifybooking() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/verify-booking/verify-booking-task-list.html",
            link: Link,
            controller: "VerifyBookingController",
            controllerAs: "VerifyBookingCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) {}
    }

    function verifyBookingEdit() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/booking/shared/my-task/my-task-directive/verify-booking/verify-booking-activity.html",
            link: Link,
            controller: "VerifyBookingController",
            controllerAs: "VerifyBookingCtrl",
            bindToController: true,
            scope: {
                currentObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) {}
    }
})();