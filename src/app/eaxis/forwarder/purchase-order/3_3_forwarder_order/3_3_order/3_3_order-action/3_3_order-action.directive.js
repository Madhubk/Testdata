(function () {
    "use strict";

    angular
        .module("Application")
        .directive("threeThreeOrderAction", ThreeThreeOrderAction);

    ThreeThreeOrderAction.$inject = [];

    function ThreeThreeOrderAction() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_order-action/3_3_order-action.html",
            controller: 'three_three_OrderActionController',
            controllerAs: 'three_three_OrderActionCtrl',
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