(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneThreeShipmentMenu", oneThreeShipmentMenu);

    oneThreeShipmentMenu.$inject = [];

    function oneThreeShipmentMenu() {
        var exports = {
            restrict: "E",
            templateUrl: "app/eaxis/buyer/freight/shipment/1_3_buyer_forwarder_shipment/1_3_shipment-menu/1_3_shipment-menu.html",
            link: Link,
            controller: "oneThreeShipmentMenuController",
            controllerAs: "oneThreeShipmentMenuCtrl",
            scope: {
                currentShipment: "=",
                activityForm: "=",
                activeTab: "=",
                bookingType: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();