(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneOneOrderAction", oneOneOrderAction);

    oneOneOrderAction.$inject = [];

    function oneOneOrderAction() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_order-action/1_1_order-action.html",
            controller: 'one_one_orderActionController',
            controllerAs: 'one_one_OrderActionCtrl',
            bindToController: true,
            scope: {
                input: "="
            },
            link: Link
        };
        return exports;

        function Link(scope, ele, attr) {}
    }
})();