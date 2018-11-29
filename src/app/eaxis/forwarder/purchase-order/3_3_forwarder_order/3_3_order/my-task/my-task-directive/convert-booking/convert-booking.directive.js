(function () {
    "use strict";

    angular
        .module("Application")
        .directive("convertbooking", ConvertBookingDirective);

    function ConvertBookingDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/purchase-order/order/my-task/my-task-directive/convert-booking/convert-booking.html",
            link: Link,
            controller: "ConvertBookingDirectiveController",
            controllerAs: "ConvertBookingDirectiveCtrl",
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