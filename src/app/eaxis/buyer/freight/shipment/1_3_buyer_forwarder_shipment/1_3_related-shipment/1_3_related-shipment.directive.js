(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneThreeRelatedShipment", oneThreeRelatedShipment);

    oneThreeRelatedShipment.$inject = [];

    function oneThreeRelatedShipment() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/shipment/1_3_buyer_forwarder_shipment/1_3_related-shipment/1_3_related-shipment.html",
            link: Link,
            controller: "oneThreeRelatedShipmentController",
            controllerAs: "oneThreeRelatedShipmentCtrl",
            scope: {
                currentShipment: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();