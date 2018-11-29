(function () {
    "use strict";

    angular
        .module("Application")
        .directive("bookingBuyerSupplierTemplate", bookingBuyerSupplierTemplate);

    bookingBuyerSupplierTemplate.$inject = [];

    function bookingBuyerSupplierTemplate() {
        var exports = {
            restrict: "E",
            templateUrl: "app/eaxis/buyer/freight/booking/1_2_buyer_supplier_booking/bkg-buyer-supplier-view-template/bkg-buyer-supplier-view-template.html",
            link: Link,
            controller: "bookingBuyerSupplierTemplateController",
            controllerAs: "bookingBuyerSupplierTemplateCtrl",
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