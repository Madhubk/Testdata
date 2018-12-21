(function () {
    "use strict"
    angular
        .module("Application")
        .directive("ccf", CargoPickupDate);

    function CargoPickupDate() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/shipment-event/shp-cargo-pickup-date/shp-cargo-pickup-date.html",
            link: Link,
            controller: "ShpCargoPickupDateController",
            controllerAs: "ShpCargoPickupDateCtrl",
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