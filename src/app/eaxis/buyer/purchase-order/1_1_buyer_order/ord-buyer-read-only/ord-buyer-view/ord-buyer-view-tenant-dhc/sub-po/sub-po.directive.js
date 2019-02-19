(function () {
    "use strict";

    angular
        .module("Application")
        .directive("ordBuyerViewSubPoDHC", OrdBuyerViewSubPoDHC);

    OrdBuyerViewSubPoDHC.$inject = [];

    function OrdBuyerViewSubPoDHC() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/1_1_buyer_order/ord-buyer-read-only/ord-buyer-view/ord-buyer-view-tenant-dhc/sub-po/sub-po.html",
            controller: "OrdBuyerViewSubPoDHCController",
            controllerAs: "OrdBuyerViewSubPoDHCCtrl",
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