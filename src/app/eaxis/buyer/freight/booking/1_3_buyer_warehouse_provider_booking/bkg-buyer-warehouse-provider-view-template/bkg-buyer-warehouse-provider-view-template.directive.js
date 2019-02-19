(function () {
    "use strict";

    angular
        .module("Application")
        .directive("bookingBuyerWarehouseProviderTemplate", bookingBuyerWarehouseProviderTemplate);

    bookingBuyerWarehouseProviderTemplate.$inject = ["$ocLazyLoad"];

    function bookingBuyerWarehouseProviderTemplate($ocLazyLoad) {
        var exports = {
            restrict: "E",
            templateUrl: "app/eaxis/buyer/freight/booking/1_3_buyer_warehouse_provider_booking/bkg-buyer-warehouse-provider-view-template/bkg-buyer-warehouse-provider-view-template.html",
            link: Link,
            controller: "bookingBuyerWarehouseProviderTemplateController",
            controllerAs: "bookingBuyerWarehouseProviderTemplateCtrl",
            scope: {
                currentBooking: "=",
                dataentryObject: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {
            $ocLazyLoad.load(["1_3_Ext_WHP_BookingDirective", "1_3_Ext_WHP_BookingPlanning"]).then(function () {

            }, function (response) {

            });
        }
    }
})();