(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneThreeOrderMenu", oneOrderMenu);

    oneOrderMenu.$inject = [];

    function oneOrderMenu() {
        var exports = {
            restrict: "E",
            templateUrl: "app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order/1_3_order-menu/1_3_order-menu.html",
            link: Link,
            controller: "one_three_orderMenuController",
            controllerAs: "one_three_orderMenuCtrl",
            scope: {
                currentOrder: "=",
                dataentryObject: "=",
                activityForm: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();