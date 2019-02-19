(function () {
    "use strict";

    angular
        .module("Application")
        .directive("cntBuyerViewOrder", cntBuyerViewOrder);

    cntBuyerViewOrder.$inject = [];

    function cntBuyerViewOrder() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/container/cnt_buyer-read-only/cnt-buyer-view/order/order.html",
            controller: "cntBuyerViewOrderController",
            controllerAs: "cntBuyerViewOrderCtrl",
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