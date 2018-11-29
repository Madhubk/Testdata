(function () {
    "use strict";

    angular
        .module("Application")
        .directive("slibooking", SLIBookingDirective);

    function SLIBookingDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/booking/my-task/my-task-directive/sli-booking/sli-booking.html",
            link: Link,
            controller: "SLIBookingDirectiveController",
            controllerAs: "SLIBookingDirectiveCtrl",
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
