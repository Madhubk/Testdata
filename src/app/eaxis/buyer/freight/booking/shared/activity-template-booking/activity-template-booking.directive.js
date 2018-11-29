(function () {
    "use strict"
    angular
        .module("Application")
        .directive("activityTemplateBooking", activityTemplateBooking);

    function activityTemplateBooking() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/booking/shared/activity-template-booking/activity-template-booking.html",
            link: Link,
            controller: "activityTemplateBookingController",
            controllerAs: "activityTemplateBookingCtrl",
            bindToController: true,
            scope: {
                taskObj: "=",
                onComplete: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) {}
    }
})();