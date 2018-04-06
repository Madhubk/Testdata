(function () {
    "use strict";

    angular
        .module("Application")
        .directive("shipmentServiceAndReference", ShipmentServiceAndReference);

    ShipmentServiceAndReference.$inject = [];

    function ShipmentServiceAndReference() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/service-and-reference/shipment-service-and-reference.html",
            link: Link,
            controller: "ShipmentServiceAndReferenceController",
            controllerAs: "ShipmentServiceAndReferenceCtrl",
            scope: {
                currentShipment: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
