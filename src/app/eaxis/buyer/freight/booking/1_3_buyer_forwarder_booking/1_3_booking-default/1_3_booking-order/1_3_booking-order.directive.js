(function () {
    "use strict";

    angular
        .module("Application")
        .directive("bkgBuyerForwarderOrder", bkgBuyerForwarderOrder);

        bkgBuyerForwarderOrder.$inject = [];

    function bkgBuyerForwarderOrder() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/booking/1_3_buyer_forwarder_booking/1_3_booking-default/1_3_booking-order/1_3_booking-order.html",
            link: Link,
            controller: "bkgBuyerForwarderOrderController",
            controllerAs: "bkgBuyerForwarderOrderCtrl",
            scope: {
                currentBooking: "=?currentBooking",
                obj:"="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();