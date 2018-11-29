(function () {
    "use strict";

    angular
        .module("Application")
        .directive("vehicleGeneral", VehicleGeneral);

    VehicleGeneral.$inject = [];
    function VehicleGeneral() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/vehicle/vehicle-general/vehicle-general.html",
            link: Link,
            controller: "VehicleGeneralController",
            controllerAs: "VehicleGeneralCtrl",
            scope: {
                currentVehicle: "="
            },
            bindToController: true
        };
        return exports;
        function Link(scope, elem, attr) {}
    }
})();
