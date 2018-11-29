(function () {
    "use strict";

    angular
        .module("Application")
        .directive("bookingAction", BookingAction);

    BookingAction.$inject = [];

    function BookingAction() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/booking/booking-action/booking-action.html",
            controller: 'BookingActionController',
            controllerAs: 'BookingActionCtrl',
            bindToController: true,
            scope: {
                input: "="
            },
            link: Link
        };
        return exports;

        function Link(scope, ele, attr) { }
    }
})();
