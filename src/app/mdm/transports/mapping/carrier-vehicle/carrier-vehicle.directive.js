(function () {
    "use strict";

    angular
        .module("Application")
        .directive("carrierVehicle", CarrierVehicle);

    CarrierVehicle.$inject = [];

    function CarrierVehicle() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/transports/mapping/carrier-vehicle/carrier-vehicle.html",
            link: Link,
            controller: "CarrierVehicleController",
            controllerAs: "CarrierVehicleCtrl",
            scope: {
                currentMapping: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();