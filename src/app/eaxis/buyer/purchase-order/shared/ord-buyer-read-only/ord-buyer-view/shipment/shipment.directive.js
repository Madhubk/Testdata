(function () {
    "use strict";

    angular
        .module("Application")
        .directive("ordBuyerViewShipment", OrdBuyerViewShipment);

    OrdBuyerViewShipment.$inject = [];

    function OrdBuyerViewShipment() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/shared/ord-buyer-read-only/ord-buyer-view/shipment/shipment.html",
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