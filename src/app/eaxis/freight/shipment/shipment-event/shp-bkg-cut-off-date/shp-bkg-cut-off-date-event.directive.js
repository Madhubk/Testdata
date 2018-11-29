(function () {
    "use strict"
    angular
        .module("Application")
        .directive("bcdex", BookingCutOffDateEvent);

    function BookingCutOffDateEvent() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/shipment-event/shp-bkg-cut-off-date/shp-bkg-cut-off-date-event.html",
            link: Link,
            controller: "ShpBkgCutOffDateDirController",
            controllerAs: "ShpBkgCutOffDateDirCtrl",
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