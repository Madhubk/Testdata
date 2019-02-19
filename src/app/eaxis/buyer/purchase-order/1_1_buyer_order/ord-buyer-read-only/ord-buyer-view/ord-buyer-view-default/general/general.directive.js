(function () {
    "use strict";

    angular
        .module("Application")
        .directive("ordBuyerViewGeneral", OrdBuyerViewGeneral);

    OrdBuyerViewGeneral.$inject = [];

    function OrdBuyerViewGeneral() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/1_1_buyer_order/ord-buyer-read-only/ord-buyer-view/ord-buyer-view-default/general/general.html",
            controller: "OrdBuyerViewGeneralController",
            controllerAs: "OrdBuyerViewGeneralCtrl",
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