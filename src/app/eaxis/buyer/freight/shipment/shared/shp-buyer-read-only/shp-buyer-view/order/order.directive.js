(function () {
    "use strict";

    angular
        .module("Application")
        .directive("shpBuyerViewOrder", shpBuyerViewOrder);

    shpBuyerViewOrder.$inject = [];

    function shpBuyerViewOrder() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/shipment/shared/shp-buyer-read-only/shp-buyer-view/order/order.html",
            controller: "shpBuyerViewOrderController",
            controllerAs: "shpBuyerViewOrderCtrl",
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