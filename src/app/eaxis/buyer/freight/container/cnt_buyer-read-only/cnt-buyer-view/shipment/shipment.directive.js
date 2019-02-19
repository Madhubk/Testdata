(function () {
    "use strict";

    angular
        .module("Application")
        .directive("cntBuyerViewShipment", CntBuyerViewShipment);

    CntBuyerViewShipment.$inject = [];

    function CntBuyerViewShipment() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/container/cnt_buyer-read-only/cnt-buyer-view/shipment/shipment.html",
            controller: "cntBuyerViewShipmentController",
            controllerAs: "cntBuyerViewShipmentCtrl",
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