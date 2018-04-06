(function () {
    "use strict";

    angular
        .module("Application")
        .directive("inventoryGeneral", InventoryGeneral);

    InventoryGeneral.$inject = [];

    function InventoryGeneral() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/inventory/inventory-general/inventory-general.html",
            link: Link,
            controller: "InventoryGeneralController",
            controllerAs: "InventoryGeneralCtrl",
            scope: {
                currentInventory:"="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
