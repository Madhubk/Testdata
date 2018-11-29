(function () {
    "use strict"
    angular.module("Application")
        .directive("shipmentGeneralDetails", ShipmentGeneralDetails);

    function ShipmentGeneralDetails() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/shipment-general-details/shipment-general-details.html",
            link: Link,
            controller: "ShipmentGeneralController",
            controllerAs: "ShpGeneralCtrl",
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