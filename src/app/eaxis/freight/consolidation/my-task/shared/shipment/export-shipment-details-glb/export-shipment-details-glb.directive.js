(function () {
    "use strict"
    angular
        .module("Application")
        .directive("exportShipmentDetailsGlb", ExportShipmentDetailsGlb);

    function ExportShipmentDetailsGlb() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/my-task/shared/shipment/export-shipment-details-glb/export-shipment-details-glb.html",
            link: Link,
            controller: "ExportShipmentDetailsGlbController",
            controllerAs: "ExportShipmentGlbCtrl",
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
