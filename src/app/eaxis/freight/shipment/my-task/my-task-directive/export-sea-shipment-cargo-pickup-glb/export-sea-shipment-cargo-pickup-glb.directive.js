(function () {
    "use strict"
    angular
        .module("Application")
        .directive("cargopickup", CargoPickup)
        .directive("exportSeaShipmentCargoPickupGlb", ExportSeaShipmentCargoPickupGlb);

    function CargoPickup() {
        var exports = {
            restrict: "EA",
            templateUrl:
                "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-cargo-pickup-glb/export-sea-shipment-cargo-pickup-glb-task-list.html",
            link: Link,
            controller: "ExportSeaShipmentCargoPickupGlbController",
            controllerAs: "ExportSeaShipmentCargoPickupGlbCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function ExportSeaShipmentCargoPickupGlb() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/my-task/my-task-directive/export-sea-shipment-cargo-pickup-glb/export-sea-shipment-cargo-pickup-glb-activity.html",
            link: Link,
            controller: "ExportSeaShipmentCargoPickupGlbController",
            controllerAs: "ExportSeaShipmentCargoPickupGlbCtrl",
            bindToController: true,
            scope: {
                currentObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }
})();
