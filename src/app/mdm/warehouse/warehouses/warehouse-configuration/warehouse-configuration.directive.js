(function () {
    "use strict";

    angular
        .module("Application")
        .directive("warehouseConfig", WarehouseConfig)

    function WarehouseConfig() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/warehouse/warehouses/warehouse-configuration/warehouse-configuration.html",
            link: Link,
            controller: "WarehouseConfigController",
            controllerAs: "WarehouseConfigCtrl",
            scope: {
                currentWarehouse: "="
            },
            bindToController: true
        };
        return exports;
        function Link(scope, elem, attr) { }
    }

})();
