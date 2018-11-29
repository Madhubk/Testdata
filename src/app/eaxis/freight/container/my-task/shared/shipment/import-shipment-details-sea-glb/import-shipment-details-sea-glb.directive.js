(function () {
    "use strict"
    angular
        .module("Application")
        .directive("importShipmentDetailsSeaGlb", ImportShipmentDetailsSeaGlb)
        .directive("importShipmentDetailsSeaGlbView", ImportShipmentDetailsSeaGlbView);

    function ImportShipmentDetailsSeaGlb() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/my-task/shared/shipment/import-shipment-details-sea-glb/import-shipment-details-sea-glb.html",
            link: Link,
            controller: "ImportShipmentDetailsSeaGlbController",
            controllerAs: "ImportShipmentSeaGlbCtrl",
            bindToController: true,
            scope: {
                currentObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function ImportShipmentDetailsSeaGlbView() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/my-task/shared/shipment/import-shipment-details-sea-glb/import-shipment-details-sea-glb-view.html",
            link: Link,
            controller: "ImportShipmentDetailsSeaGlbController",
            controllerAs: "ImportShipmentSeaGlbCtrl",
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
