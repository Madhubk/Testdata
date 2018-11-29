(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneOneOrderMenu", oneOrderMenu);

    oneOrderMenu.$inject = [];

    function oneOrderMenu() {
        var exports = {
            restrict: "E",
            templateUrl: "app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_order-menu/1_1_order-menu.html",
            link: Link,
            controller: "one_one_orderMenuController",
            controllerAs: "one_one_orderMenuCtrl",
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