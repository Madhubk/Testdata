(function () {
    "use strict";

    angular
        .module("Application")
        .directive("shipmentDetailsDirective", ShipmentDetailsDirective);

    ShipmentDetailsDirective.$inject = [];

    function ShipmentDetailsDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/Shipment-details/Shipment-details.html",
            link: Link,
            controller: "ShipmentDetailsController",
            controllerAs: "ShipmentDetailsCtrl",
            scope: {
                currentObj: "=",
                readOnly: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) { }
    }
})();
