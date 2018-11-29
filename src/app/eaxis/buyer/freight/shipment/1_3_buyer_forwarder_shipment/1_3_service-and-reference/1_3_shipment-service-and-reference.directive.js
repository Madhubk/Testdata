(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneThreeShipmentServiceAndReference", oneThreeShipmentServiceAndReference);

    oneThreeShipmentServiceAndReference.$inject = [];

    function oneThreeShipmentServiceAndReference() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/shipment/1_3_buyer_forwarder_shipment/1_3_service-and-reference/1_3_shipment-service-and-reference.html",
            link: Link,
            controller: "oneThreeShipmentServiceAndReferenceController",
            controllerAs: "oneThreeShipmentServiceAndReferenceCtrl",
            scope: {
                currentShipment: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();