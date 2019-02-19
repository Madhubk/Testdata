(function () {
    "use strict";

    angular
        .module("Application")
        .directive("deliveryOrdBuyerViewGeneral", DeliveryOrdBuyerViewGeneral);

    DeliveryOrdBuyerViewGeneral.$inject = [];

    function DeliveryOrdBuyerViewGeneral() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/1_1_buyer_delivery_order/delivery-ord-buyer-view/delivery-ord-buyer-view-default/general/general.html",
            controller: "DeliveryOrdBuyerViewGeneralController",
            controllerAs: "DeliveryOrdBuyerViewGeneralCtrl",
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