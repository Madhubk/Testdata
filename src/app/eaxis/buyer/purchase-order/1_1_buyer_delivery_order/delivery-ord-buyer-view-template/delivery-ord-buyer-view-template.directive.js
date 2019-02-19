(function () {
    "use strict";

    angular
        .module("Application")
        .directive("deliveryOrdBuyerViewTemplate", DeliveryOrdBuyerViewTemplate);

    DeliveryOrdBuyerViewTemplate.$inject = [];

    function DeliveryOrdBuyerViewTemplate() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/1_1_buyer_delivery_order/delivery-ord-buyer-view-template/delivery-ord-buyer-view-template.html",
            controller: "DeliveryOrdBuyerViewTemplateController",
            controllerAs: "DeliveryOrdBuyerViewTemplateCtrl",
            scope: {
                currentOrder: "=",
                dataentryObject: "="
            },
            link: Link,
            bindToController: true
        };
        return exports;

        function Link(scope, ele, attr) {}
    }
})();