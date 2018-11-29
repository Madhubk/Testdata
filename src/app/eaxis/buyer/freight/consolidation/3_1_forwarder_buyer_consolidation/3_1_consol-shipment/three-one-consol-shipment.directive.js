(function () {
    "use strict";

    angular
        .module("Application")
        .directive("threeOneConsolShipment", ThreeOneConsolShipment);

        ThreeOneConsolShipment.$inject = [];

    function ThreeOneConsolShipment() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/consolidation/3_1_forwarder_buyer_consolidation/3_1_consol-shipment/three-one-consol-shipment.html",
            link: Link,
            controller: "ThreeOneConsolShipmentController",
            controllerAs: "ThreeOneConsolShipmentCtrl",
            scope: {
                currentConsol: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
