(function () {
    "use strict"
    angular
        .module("Application")
        .directive("exportShipmentDetailsSeaGlb", ExportShipmentDetailsSeaGlb)
        .directive("exportShipmentDetailsSeaGlbView", ExportShipmentDetailsSeaGlbView);

    function ExportShipmentDetailsSeaGlb() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/my-task/shared/shipment/export-shipment-details-sea-glb/export-shipment-details-sea-glb.html",
            link: Link,
            controller: "ExportShipmentDetailsSeaGlbController",
            controllerAs: "ExportShipmentSeaGlbCtrl",
            bindToController: true,
            scope: {
                currentObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function ExportShipmentDetailsSeaGlbView() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/my-task/shared/shipment/export-shipment-details-sea-glb/export-shipment-details-sea-glb-view.html",
            link: Link,
            controller: "ExportShipmentDetailsSeaGlbController",
            controllerAs: "ExportShipmentSeaGlbCtrl",
            bindToController: true,
            scope: {
                currentObj: "=",
                readOnly: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

})();
