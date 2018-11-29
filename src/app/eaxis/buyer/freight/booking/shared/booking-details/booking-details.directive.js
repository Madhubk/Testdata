(function () {
    "use strict"
    angular
        .module("Application")
        .directive("bookingDetails", bookingDetails);

    function bookingDetails() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/booking/shared/booking-details/booking-details.html",
            link: Link,
            controller: "bookingDetailsController",
            controllerAs: "bookingDetailsCtrl",
            bindToController: true,
            scope: {
                taskObj: "=",
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) {}
    }

})();