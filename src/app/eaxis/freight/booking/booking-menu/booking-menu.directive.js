(function () {
    "use strict";

    angular
        .module("Application")
        .directive("bookingMenu", BookingMenu);

    BookingMenu.$inject = [];

    function BookingMenu() {
        var exports = {
            restrict: "E",
            templateUrl: "app/eaxis/freight/booking/booking-menu/booking-menu.html",
            link: Link,
            controller: "BookingMenuController",
            controllerAs: "BookingMenuCtrl",
            scope: {
                currentBooking: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
