(function () {
    "use strict"
    angular
        .module("Application")
        .directive("bas", IsBookingEvent);

    function IsBookingEvent() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/shipment-event/bkg-approval-event/bkg-approval-event.html",
            link: Link,
            controller: "BkgApprovalDirController",
            controllerAs: "BkgApprovalDirCtrl",
            bindToController: true,
            scope: {
                eventObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }
})();