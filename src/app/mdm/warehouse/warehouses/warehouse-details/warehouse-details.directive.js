(function () {
    "use strict";

    angular
        .module("Application")
        .directive("warehouseDetails", WarehouseDetails);

    WarehouseDetails.$inject = [];
    function WarehouseDetails() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/warehouse/warehouses/warehouse-details/warehouse-details.html",
            link: Link,
            controller: "WarehouseDetailsController",
            controllerAs: "WarehouseDetailsCtrl",
            scope: {
                currentWarehouse: "="
            },
            bindToController: true
        };
        return exports;
        function Link(scope, elem, attr) {}
    }
})();
