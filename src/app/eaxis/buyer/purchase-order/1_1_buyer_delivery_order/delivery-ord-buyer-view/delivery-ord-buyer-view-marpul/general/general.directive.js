(function () {
    "use strict";

    angular
        .module("Application")
        .directive("deliveryOrdBuyerMarpulViewGeneral", DeliveryOrdBuyerMarpulViewGeneral);

    DeliveryOrdBuyerMarpulViewGeneral.$inject = [];

    function DeliveryOrdBuyerMarpulViewGeneral() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/order-shared/delivery-ord-buyer-read-only/delivery-ord-buyer-view/delivery-ord-buyer-view-marpul/general/general.html",
            controller: "DeliveryOrdBuyerMarpulViewGeneralController",
            controllerAs: "DeliveryOrdBuyerMarpulViewGeneralCtrl",
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