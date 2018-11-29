(function () {
    "use strict";

    angular
        .module("Application")
        .directive("orderViewDefaultGeneral", OrderViewDefaultGeneral);

    OrderViewDefaultGeneral.$inject = [];

    function OrderViewDefaultGeneral() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/1_2_buyer_supplier_order/1_2_order/1_2_order_view_default/general/general.html",
            controller: "OrderViewDefaultGeneralController",
            controllerAs: "OrderViewDefaultGeneralCtrl",
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