(function () {
    "use strict"
    angular
        .module("Application")
        .directive("ccdex", CargoCuttOffDateEvent);

    function CargoCuttOffDateEvent() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/shipment-event/shp-cargo-cutt-off-date/shp-cargo-cutt-off-date.html",
            link: Link,
            controller: "ShpCargoCutOffDateDirController",
            controllerAs: "ShpCargoCutOffDateDirCtrl",
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