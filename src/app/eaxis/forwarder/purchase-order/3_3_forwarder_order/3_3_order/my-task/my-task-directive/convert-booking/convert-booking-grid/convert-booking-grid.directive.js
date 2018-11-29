(function () {
    "use strict";

    angular
        .module("Application")
        .directive("convertBookingGridDirective", ConvertBookingGridDirective);

    ConvertBookingGridDirective.$inject = [];

    function ConvertBookingGridDirective() {
        var exports = {
            restrict: "E",
            templateUrl: "app/eaxis/purchase-order/order/my-task/my-task-directive/convert-booking/convert-booking-grid/convert-booking-grid-directive.html",
            link: Link,
            controller: "ConvertBookingGridDirectiveController",
            controllerAs: "ConvertBookingGridDirectiveCtrl",
            scope: {
                input: "=",
                gridChange: "&"
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();