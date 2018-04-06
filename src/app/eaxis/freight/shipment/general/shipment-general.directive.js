(function () {
    "use strict";

    angular
        .module("Application")
        .directive("shipmentGeneral", ShipmentGeneral);

    ShipmentGeneral.$inject = [];

    function ShipmentGeneral() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/general/shipment-general.html",
            link: Link,
            controller: "GeneralController",
            controllerAs: "GeneralCtrl",
            scope: {
                currentShipment: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
