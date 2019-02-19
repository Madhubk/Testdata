(function () {
    "use strict";

    angular
        .module("Application")
        .directive("ordBuyerViewSubPo", OrdBuyerViewSubPo);

    OrdBuyerViewSubPo.$inject = [];

    function OrdBuyerViewSubPo() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/1_1_buyer_order/ord-buyer-read-only/ord-buyer-view/ord-buyer-view-default/sub-po/sub-po.html",
            controller: "OrdBuyerViewSubPoController",
            controllerAs: "OrdBuyerViewSubPoCtrl",
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