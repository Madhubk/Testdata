(function () {
    "use strict";

    angular
        .module("Application")
        .directive("shipmentDynamicTable", ShipmentDynamicTable);

    ShipmentDynamicTable.$inject = [];

    function ShipmentDynamicTable() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/shipment-dynamic-table/shipment-dynamic-table.html",
            link: Link,
            controller: "ShipmentDynamicTableController",
            controllerAs: "ShipmentDynamicTableCtrl",
            scope: {
                currentObject: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
