(function () {
    "use strict";

    angular
        .module("Application")
        .directive("orderViewDefaultSubPo", OrderViewDefaultSubPo);

    OrderViewDefaultSubPo.$inject = [];

    function OrderViewDefaultSubPo() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/1_2_buyer_supplier_order/1_2_order/1_2_order_view_default/sub-po/sub-po.html",
            controller: "OrderViewDefaultSubPoController",
            controllerAs: "OrderViewDefaultSubPoCtrl",
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