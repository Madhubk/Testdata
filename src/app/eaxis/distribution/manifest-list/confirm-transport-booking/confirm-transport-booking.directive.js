(function () {
    "use strict";

    angular
        .module("Application")
        .directive("confirmTransport", ConfirmTransportBooking);

    ConfirmTransportBooking.$inject = [];

    function ConfirmTransportBooking() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/manifest-list/confirm-transport-booking/confirm-transport-booking.html",
            link: Link,
            controller: "ConfirmTransportController",
            controllerAs: "ConfirmTransportCtrl",
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