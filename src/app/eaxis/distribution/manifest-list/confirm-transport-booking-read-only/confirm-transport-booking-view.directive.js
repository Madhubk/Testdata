(function () {
    "use strict";

    angular
        .module("Application")
        .directive("confirmBookingView", confirmBookingView);

    confirmBookingView.$inject = [];

    function confirmBookingView() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/manifest-list/confirm-transport-booking-read-only/confirm-transport-booking-view.html",
            link: Link,
            controller: "ConfirmBookingViewController",
            controllerAs: "ConfirmBookingViewCtrl",
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


