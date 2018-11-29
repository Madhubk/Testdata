(function () {
    "use strict";

    angular
        .module("Application")
        .directive("shipmentAction", ShipmentAction);

    ShipmentAction.$inject = [];

    function ShipmentAction() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/shipment-action/shipment-action.html",
            controller: 'shipmentActionController',
            controllerAs: 'ShipmentActionCtrl',
            bindToController: true,
            scope: {
                input: "="
            },
            link: Link
        };
        return exports;

        function Link(scope, ele, attr) {}
    }
})();