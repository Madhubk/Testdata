(function () {
    "use strict";

    angular
        .module("Application")
        .directive("locationMenu", LocationMenu);

    LocationMenu.$inject = [];

    function LocationMenu() {
        var exports = {
            restrict: "E",
            templateUrl: "app/mdm/warehouse/locations/location-menu/location-menu.html",
            link: Link,
            controller: "LocationMenuController",
            controllerAs: "LocationMenuCtrl",
            scope: {
                currentLocation: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
