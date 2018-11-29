(function () {
    "use strict";

    angular
        .module("Application")
        .directive("warehouseMenu", WarehouseMenu);

    WarehouseMenu.$inject = [];

    function WarehouseMenu() {
        var exports = {
            restrict: "E",
            templateUrl: "app/mdm/warehouse/warehouses/warehouse-menu/warehouse-menu.html",
            link: Link,
            controller: "WarehouseMenuController",
            controllerAs: "WarehouseMenuCtrl",
            scope: {
                currentWarehouse: "=",
                dataentryObject:"="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
