(function () {
    "use strict";

    angular
        .module("Application")
        .directive("ordBuyerViewOrderLineDhc", OrdBuyerViewOrderLineDhc);

    OrdBuyerViewOrderLineDhc.$inject = [];

    function OrdBuyerViewOrderLineDhc() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/1_1_buyer_order/ord-buyer-read-only/ord-buyer-view/ord-buyer-view-tenant-dhc/order-line/order-line.html",
            controller: "OrdBuyerViewOrderLineDhcController",
            controllerAs: "OrdBuyerViewOrderLineDhcCtrl",
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