(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneThreeOrderAction", oneThreeOrderAction);

    oneThreeOrderAction.$inject = [];

    function oneThreeOrderAction() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order/1_3_order-action/1_3_order-action.html",
            controller: 'one_three_orderActionController',
            controllerAs: 'one_three_OrderActionCtrl',
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