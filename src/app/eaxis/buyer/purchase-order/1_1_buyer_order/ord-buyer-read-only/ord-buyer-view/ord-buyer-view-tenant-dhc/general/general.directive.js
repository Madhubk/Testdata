(function () {
    "use strict";

    angular
        .module("Application")
        .directive("ordBuyerViewGeneralDhc", OrdBuyerViewGeneralDhc);

    OrdBuyerViewGeneralDhc.$inject = [];

    function OrdBuyerViewGeneralDhc() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/1_1_buyer_order/ord-buyer-read-only/ord-buyer-view/ord-buyer-view-tenant-dhc/general/general.html",
            controller: "OrdBuyerViewGeneralDhcController",
            controllerAs: "OrdBuyerViewGeneralDhcCtrl",
            scope: {
                obj: "="
            },
            link: Link,
            bindToController: true
        };
        return exports;

        function Link(scope, ele, attr) {}
    }
})();