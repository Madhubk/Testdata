(function () {
    "use strict"
    angular
        .module("Application")
        .directive("shipmentDetailsListGlb", ShipmentDetailsListGlb);

    function ShipmentDetailsListGlb() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/consolidation/1_4_buyer_imp_frwd_consollidation/my-task/shared/shipment-details-list-glb/shipment-details-list-glb.html",
            link: Link,
            controller: "ShipmentDetailsListGlbController",
            controllerAs: "ShipmentListGlbCtrl",
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
