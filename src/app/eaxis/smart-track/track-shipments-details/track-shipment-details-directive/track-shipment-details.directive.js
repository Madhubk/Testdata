(function () {
    "use strict";

    angular
        .module("Application")
        .directive("trackShipmentDetailsDirective", TrackShipmentDetailsDirective);

    TrackShipmentDetailsDirective.$inject = [];

    function TrackShipmentDetailsDirective() {
        var exports = {
            restrict: "E",
            templateUrl: "app/eaxis/smart-track/track-shipments-details/track-shipment-details-directive/track-shipment-details-directive.html",
            link: Link,
            controller: "trackShipmentDetailsDirectiveController",
            controllerAs: "TrackShipmentDetailsDirectiveCtrl",
            scope: {
                currentShipment: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();