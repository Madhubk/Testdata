(function () {
    "use strict";

    angular
        .module("Application")
        .directive("consolShipment", ConsolShipment);

        ConsolShipment.$inject = [];

    function ConsolShipment() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/consol-shipment/consol-shipment.html",
            link: Link,
            controller: "ConsolShipmentController",
            controllerAs: "ConsolShipmentCtrl",
            scope: {
                currentConsol: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
