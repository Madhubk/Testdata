(function () {
    "use strict";

    angular
        .module("Application")
        .directive("locationDetails", LocationDetails);

    LocationDetails.$inject = [];
    function LocationDetails() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/warehouse/locations/location-details/location-details.html",
            link: Link,
            controller: "LocationDetailsController",
            controllerAs: "LocationDetailsCtrl",
            scope: {
                currentLocation: "="
            },
            bindToController: true
        };
        return exports;
        function Link(scope, elem, attr) {}
    }
})();