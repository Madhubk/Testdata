(function () {
    "use strict";

    angular
        .module("Application")
        .directive("inventoryGeneralCust", InventoryGeneralCust);

    InventoryGeneralCust.$inject = [];

    function InventoryGeneralCust() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/customer-view/inventory-customer-view/inventory-general/inventory-general.html",
            link: Link,
            controller: "InventoryGeneralCustController",
            controllerAs: "InventoryGeneralCustCtrl",
            scope: {
                currentInventory:"="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
