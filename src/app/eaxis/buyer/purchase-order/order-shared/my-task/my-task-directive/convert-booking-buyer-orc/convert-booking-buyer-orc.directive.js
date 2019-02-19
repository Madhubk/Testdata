(function () {
    "use strict";

    angular
        .module("Application")
        .directive("convertbookingbuyerorc", ConvertBookingBuyerOrcDirective);

    function ConvertBookingBuyerOrcDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/order-shared/my-task/my-task-directive/convert-booking-buyer-orc/convert-booking-buyer-orc.html",
            link: Link,
            controller: "ConvertBookingBuyerOrcDirectiveController",
            controllerAs: "ConvertBookingBuyerOrcDirectiveCtrl",
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