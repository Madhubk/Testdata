(function () {
    "use strict";

    angular
        .module("Application")
        .directive("vehicleMenu", VehicleMenu);

    VehicleMenu.$inject = [];

    function VehicleMenu() {
        var exports = {
            restrict: "E",
            templateUrl: "app/mdm/vehicle/vehicle-menu/vehicle-menu.html",
            link: Link,
            controller: "VehicleMenuController",
            controllerAs: "VehicleMenuCtrl",
            scope: {
                currentVehicle: "=",
                dataentryObject:"="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
