(function () {
    "use strict";

    angular
        .module("Application")
        .directive("tracking", Tracking);

    Tracking.$inject = [];

    function Tracking() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/manifest-list/tracking/tracking.html",
            link: Link,
            controller: "TrackingController",
            controllerAs: "TrackingCtrl",
            scope: {
                currentManifest: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }
    }

})();