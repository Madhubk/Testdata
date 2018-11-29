(function () {
    "use strict";

    angular
        .module("Application")
        .directive("shipmentEntityDetails", ShipmentEntityDetails);

    ShipmentEntityDetails.$inject = [];

    function ShipmentEntityDetails() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/shipment-entity-details/shipment-entity-details.html",
            link: Link,
            controller: "ShipmentEntityDetailsController",
            controllerAs: "ShipmentEntityDetailsCtrl",
            scope: {
                currentObj: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
