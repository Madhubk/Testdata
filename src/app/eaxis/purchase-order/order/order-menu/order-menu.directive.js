(function () {
    "use strict";

    angular
        .module("Application")
        .directive("orderMenu", OrderMenu);

    OrderMenu.$inject = [];

    function OrderMenu() {
        var exports = {
            restrict: "E",
            templateUrl: "app/eaxis/purchase-order/order/order-menu/order-menu.html",
            link: Link,
            controller: "OrderMenuController",
            controllerAs: "OrderMenuCtrl",
            scope: {
                currentOrder: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
