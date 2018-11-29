(function () {
    "use strict"
    angular
        .module("Application")
        .directive("shc", ShipmentCreationEvent);

    function ShipmentCreationEvent() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/shipment-event/shp-creation/shp-creation-event.html",
            link: Link,
            controller: "ShpCreationDirController",
            controllerAs: "ShpCreationDirCtrl",
            bindToController: true,
            scope: {
                eventObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }
})();