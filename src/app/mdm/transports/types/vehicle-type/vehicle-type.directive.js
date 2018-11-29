(function () {
    "use strict";

    angular
        .module("Application")
        .directive("vehicleType", VehicleType);

    VehicleType.$inject = [];

    function VehicleType() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/transports/types/vehicle-type/vehicle-type.html",
            link: Link,
            controller: "VehicleTypeController",
            controllerAs: "VehicleTypeCtrl",
            scope: {
                currentType: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();