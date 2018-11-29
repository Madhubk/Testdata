(function () {
    "use strict";

    angular
        .module("Application")
        .directive("bookingcancellationedit", BookingCancellationEditDirective);

        BookingCancellationEditDirective.$inject = [];

    function BookingCancellationEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/booking/my-task/my-task-directive/booking-cancellation/booking-cancellation/booking-cancellation-edit/booking-cancellation-edit.html",
            controller: "BookingCancellationEditDirectiveController",
            controllerAs: "BookingCancellationEditDirectiveCtrl",
            bindToController: true,
            link: Link,
            scope: {
                taskObj: "=",
                entityObj: "=",
                tabObj: "=",
                onComplete: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, ele, attr) { }
    }
})();
