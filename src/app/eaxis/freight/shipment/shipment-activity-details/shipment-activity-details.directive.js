(function () {
    "use strict";

    angular
        .module("Application")
        .directive("shipmentActivityDetails", ShipmentActivityDetails);

    ShipmentActivityDetails.$inject = [];

    function ShipmentActivityDetails() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/shipment-activity-details/shipment-activity-details.html",
            link: Link,
            controller: "ShipmentActivityDetailsController",
            controllerAs: "ShipmentActivityDetailsCtrl",
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
