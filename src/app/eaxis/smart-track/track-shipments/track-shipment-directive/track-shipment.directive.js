(function () {
    "use strict";

    angular
        .module("Application")
        .directive("trackShipmentDirective", TrackShipmentDirective);

    TrackShipmentDirective.$inject = [];

    function TrackShipmentDirective() {
        var exports = {
            restrict: "E",
            templateUrl: "app/eaxis/smart-track/track-shipments/track-shipment-directive/track-shipment-directive.html",
            link: Link,
            controller: "trackShipmentDirectiveController",
            controllerAs: "TrackShipmentDirectiveCtrl",
            scope: {
                currentShipment: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
