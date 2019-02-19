(function () {
    "use strict";

    angular
        .module("Application")
        .directive("ordBuyerViewShipment", OrdBuyerViewShipment);

    OrdBuyerViewShipment.$inject = [];

    function OrdBuyerViewShipment() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/1_1_buyer_order/ord-buyer-read-only/ord-buyer-view/ord-buyer-view-default/shipment/shipment.html",
            controller: "OrdBuyerViewShipmentController",
            controllerAs: "OrdBuyerViewShipmentCtrl",
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