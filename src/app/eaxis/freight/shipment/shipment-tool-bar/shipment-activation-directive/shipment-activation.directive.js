(function () {
    "use strict";

    angular
        .module("Application")
        .directive("shipmentActivation", ShipmentActivation);

    ShipmentActivation.$inject = [];

    function ShipmentActivation() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/shipment-tool-bar/shipment-activation-directive/shipment-activation.html",
            link: Link,
            controller: "ShipmentActivationController",
            controllerAs: "ShipmentActivationCtrl",
            scope: {
                input: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
    }

})();