(function () {
    "use strict";

    angular
        .module("Application")
        .directive("inventoryMenuCust", InventoryMenuCust);

    InventoryMenuCust.$inject = [];

    function InventoryMenuCust() {
        var exports = {
            restrict: "E",
            templateUrl: "app/eaxis/warehouse/customer-view/inventory-customer-view/inventory-menu/inventory-menu.html",
            link: Link,
            controller: "InventoryMenuCustController",
            controllerAs: "InventoryMenuCustCtrl",
            scope: {
                currentInventory:"="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
