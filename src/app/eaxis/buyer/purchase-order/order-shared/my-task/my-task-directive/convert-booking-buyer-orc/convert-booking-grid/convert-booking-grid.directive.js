(function () {
    "use strict";

    angular
        .module("Application")
        .directive("convertBookingSupplierGridDirective", ConvertBookingSupplierGridDirective)
        .directive("convertBookingBranchGridDirective", ConvertBookingBranchGridDirective);

    ConvertBookingSupplierGridDirective.$inject = [];
    ConvertBookingBranchGridDirective.$inject = [];

    function ConvertBookingSupplierGridDirective() {
        var exports = {
            restrict: "E",
            templateUrl: "app/eaxis/buyer/purchase-order/order-shared/my-task/my-task-directive/convert-booking-buyer-orc/convert-booking-grid/convert-booking-supplier-grid.html",
            link: Link,
            controller: "ConvertBookingSupplierGridDirectiveController",
            controllerAs: "ConvertBookingSupplierGridDirectiveCtrl",
            scope: {
                input: "=",
                gridChange: "&"
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }

    function ConvertBookingBranchGridDirective() {
        var exports = {
            restrict: "E",
            templateUrl: "app/eaxis/buyer/purchase-order/order-shared/my-task/my-task-directive/convert-booking-buyer-orc/convert-booking-grid/convert-booking-branch-grid.html",
            link: Link,
            controller: "ConvertBookingBranchGridDirectiveController",
            controllerAs: "ConvertBookingBranchGridDirectiveCtrl",
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