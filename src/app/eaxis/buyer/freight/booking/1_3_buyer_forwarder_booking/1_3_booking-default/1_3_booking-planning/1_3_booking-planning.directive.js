(function () {
    "use strict";

    angular
        .module("Application")
        .directive("bkgBuyerForwarderPlanning", bkgBuyerForwarderPlanning);

    bkgBuyerForwarderPlanning.$inject = [];

    function bkgBuyerForwarderPlanning() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/booking/1_3_buyer_forwarder_booking/1_3_booking-default/1_3_booking-planning/1_3_booking-planning.html",
            link: Link,
            controller: "bkgBuyerForwarderPlanningController",
            controllerAs: "bkgBuyerForwarderPlanningCtrl",
            scope: {
                currentBooking: "=?currentBooking",
                obj: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();