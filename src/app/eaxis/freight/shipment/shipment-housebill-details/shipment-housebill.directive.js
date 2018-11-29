(function () {
    "use strict";

    angular
        .module("Application")
        .directive("shipmentHouseBillDetails", ShipmentHouseBillDetails);

    ShipmentHouseBillDetails.$inject = [];

    function ShipmentHouseBillDetails() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/shipment-housebill-details/shipment-housebill-details.html",
            link: Link,
            controller: "ShipmentHouseBillDetailsController",
            controllerAs: "ShipmentHouseBillDetailsCtrl",
            scope: {
                currentObj: "=",
                readOnly: "=",
                listSource: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) { }
    }
})();
