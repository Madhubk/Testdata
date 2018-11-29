(function () {
    "use strict";

    angular
        .module("Application")
        .directive("bookingBuyerForwarderTemplate", bookingBuyerForwarderTemplate);

    bookingBuyerForwarderTemplate.$inject = [];

    function bookingBuyerForwarderTemplate() {
        var exports = {
            restrict: "E",
            templateUrl: "app/eaxis/buyer/freight/booking/1_3_buyer_forwarder_booking/bkg-buyer-forwarder-view-template/bkg-buyer-forwarder-view-template.html",
            link: Link,
            controller: "bookingBuyerForwarderTemplateController",
            controllerAs: "bookingBuyerForwarderTemplateCtrl",
            scope: {
                currentBooking: "=",
                dataentryObject: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();