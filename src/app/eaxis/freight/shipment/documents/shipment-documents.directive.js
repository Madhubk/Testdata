(function () {
    "use strict";

    angular
        .module("Application")
        .directive("shipmentDocuments", ShipmentDocuments);

    ShipmentDocuments.$inject = [];

    function ShipmentDocuments() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/documents/shipment-documents.html",
            link: Link,
            controller: "ShipmentDocumentsController",
            controllerAs: "ShipmentDocumentsCtrl",
            scope: {
                currentShipment: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
