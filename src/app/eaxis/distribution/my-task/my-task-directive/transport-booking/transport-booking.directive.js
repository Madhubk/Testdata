(function () {
    "use strict";

    angular
        .module("Application")
        .directive("transportbooking", TransportBookingDirective);

    function TransportBookingDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/my-task/my-task-directive/transport-booking/transport-booking.html",
            link: Link,
            controller: "TransportBookingDirectiveController",
            controllerAs: "TransportBookingCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }
})();
