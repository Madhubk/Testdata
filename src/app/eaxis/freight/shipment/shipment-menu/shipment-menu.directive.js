(function () {
    "use strict";

    angular
        .module("Application")
        .directive("shipmentMenu", ShipmentMenu);

    ShipmentMenu.$inject = [];

    function ShipmentMenu() {
        var exports = {
            restrict: "E",
            templateUrl: "app/eaxis/freight/shipment/shipment-menu/shipment-menu.html",
            link: Link,
            controller: "ShipmentMenuController",
            controllerAs: "ShipmentMenuCtrl",
            scope: {
                currentShipment: "=",
                activityForm: "=",
                activeTab: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
