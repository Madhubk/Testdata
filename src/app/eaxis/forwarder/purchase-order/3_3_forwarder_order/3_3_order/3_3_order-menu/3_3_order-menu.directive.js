(function () {
    "use strict";

    angular
        .module("Application")
        .directive("threeThreeOrderMenu", ThreeThreeOrderMenu);

    ThreeThreeOrderMenu.$inject = [];

    function ThreeThreeOrderMenu() {
        var exports = {
            restrict: "E",
            templateUrl: "app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_order-menu/3_3_order-menu.html",
            link: Link,
            controller: "three_three_OrderMenuController",
            controllerAs: "three_three_OrderMenuCtrl",
            scope: {
                currentOrder: "=",
                currentObj: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();