(function () {
    "use strict";

    angular
        .module("Application")
        .directive("linkedShipment", LinkedShipment);

        LinkedShipment.$inject = [];

    function LinkedShipment() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/linked-shipment/linked-shipment.html",
            link: Link,
            controller: "LinkedShipmentController",
            controllerAs: "LinkedShipmentCtrl",
            scope: {
                currentObj: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
