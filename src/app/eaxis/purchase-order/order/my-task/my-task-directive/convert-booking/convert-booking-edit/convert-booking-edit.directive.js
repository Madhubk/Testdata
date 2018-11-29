(function () {
    "use strict";

    angular
        .module("Application")
        .directive("convertbookingbranchedit", ConvertBookingBranchEditDirective)
        .directive("convertbookingsupplieredit", ConvertBookingSupplierEditDirective);

    ConvertBookingBranchEditDirective.$inject = [];
    ConvertBookingSupplierEditDirective.$inject = [];

    function ConvertBookingBranchEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/purchase-order/order/my-task/my-task-directive/convert-booking/convert-booking-edit/convert-booking-branch-edit.html",
            controller: "ConvertBookingBranchEditDirectiveController",
            controllerAs: "ConvertBookingBranchEditDirectiveCtrl",
            bindToController: true,
            link: Link,
            scope: {
                taskObj: "=",
                entityObj: "=",
                tabObj: "=",
                onComplete: "&",
                onRefreshStatusCount: "&",
                onRefreshTask: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, ele, attr) {}
    }

    function ConvertBookingSupplierEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/purchase-order/order/my-task/my-task-directive/convert-booking/convert-booking-edit/convert-booking-supplier-edit.html",
            controller: "ConvertBookingSupplierEditDirectiveController",
            controllerAs: "ConvertBookingSupplierEditDirectiveCtrl",
            bindToController: true,
            link: Link,
            scope: {
                taskObj: "=",
                entityObj: "=",
                tabObj: "=",
                onComplete: "&",
                onRefreshStatusCount: "&",
                onRefreshTask: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, ele, attr) {}
    }
})();