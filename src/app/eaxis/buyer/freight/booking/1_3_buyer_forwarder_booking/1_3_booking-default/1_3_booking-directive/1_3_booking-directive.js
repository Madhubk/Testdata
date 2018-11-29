(function () {
    "use strict";

    angular
        .module("Application")
        .directive("bkgBuyerForwarderDirective", bkgBuyerForwarderDirective);

    bkgBuyerForwarderDirective.$inject = [];

    function bkgBuyerForwarderDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/booking/1_3_buyer_forwarder_booking/1_3_booking-default/1_3_booking-directive/1_3_booking-directive.html",
            link: Link,
            controller: "bkgBuyerForwarderDirectiveController",
            controllerAs: "bkgBuyerForwarderDirectiveCtrl",
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