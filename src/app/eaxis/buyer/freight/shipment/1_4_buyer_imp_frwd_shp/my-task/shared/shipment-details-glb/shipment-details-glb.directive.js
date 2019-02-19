(function () {
    "use strict"
    angular
        .module("Application")
        .directive("shipmentDetailsGlb", ShipmentDetailsGlb)
        .directive("shipmentDetailsGlbView", ShipmentDetailsGlbView);

    function ShipmentDetailsGlb() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/shipment/1_4_buyer_imp_frwd_shp/my-task/shared/shipment-details-glb/shipment-details-glb.html",
            link: Link,
            controller: "ShipmentDetailsGlbController",
            controllerAs: "ShipmentGlbCtrl",
            bindToController: true,
            scope: {
                currentObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function ShipmentDetailsGlbView() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/shipment/1_4_buyer_imp_frwd_shp/my-task/shared/shipment-details-glb/shipment-details-glb-view.html",
            link: Link,
            controller: "ShipmentDetailsGlbController",
            controllerAs: "ShipmentGlbCtrl",
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
