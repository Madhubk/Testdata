(function () {
    "use strict";

    angular
        .module("Application")
        .directive("dockoutVehicle", DockoutVehicle);

    DockoutVehicle.$inject = [];

    function DockoutVehicle() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/manifest-list/dockout-vehicle/dockout-vehicle.html",
            link: Link,
            controller: "DockoutVehicleController",
            controllerAs: "DockoutVehicleCtrl",
            scope: {
                currentManifest: "=",
                orgfk: "=",
                jobfk:"=",
                isShowFooter:"=",
                dataentryObject: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();