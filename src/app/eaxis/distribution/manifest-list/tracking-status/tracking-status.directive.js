(function () {
    "use strict";

    angular
        .module("Application")
        .directive("trackingStatus", TrackingStatus);

    TrackingStatus.$inject = [];

    function TrackingStatus() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/manifest-list/tracking-status/tracking-status.html",
            link: Link,
            controller: "TrackingStatusController",
            controllerAs: "TrackingStatusCtrl",
            scope: {
                currentManifest: "=",
                dataentryObject: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();