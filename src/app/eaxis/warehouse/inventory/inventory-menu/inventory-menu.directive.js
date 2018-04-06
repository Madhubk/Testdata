(function () {
    "use strict";

    angular
        .module("Application")
        .directive("inventoryMenu", InventoryMenu);

    InventoryMenu.$inject = [];

    function InventoryMenu() {
        var exports = {
            restrict: "E",
            templateUrl: "app/eaxis/warehouse/inventory/inventory-menu/inventory-menu.html",
            link: Link,
            controller: "InventoryMenuController",
            controllerAs: "InventoryMenuCtrl",
            scope: {
                currentInventory:"="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
