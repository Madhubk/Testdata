(function () {
    "use strict";

    angular
        .module("Application")
        .directive("dockinVehicle", DockinVehicle);

    DockinVehicle.$inject = [];

    function DockinVehicle() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/manifest-list/dockin-vehicle/dockin-vehicle.html",
            link: Link,
            controller: "DockinVehicleController",
            controllerAs: "DockinVehicleCtrl",
            scope: {
                currentManifest: "=",
                orgfk: "=",
                jobfk: "=",
                isShowFooter: "=",
                dataentryObject: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();