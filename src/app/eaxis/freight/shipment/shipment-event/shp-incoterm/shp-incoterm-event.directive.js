(function () {
    "use strict"
    angular
        .module("Application")
        .directive("incotm", IncotermEvent);

    function IncotermEvent() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/shipment-event/shp-incoterm/shp-incoterm-event.html",
            link: Link,
            controller: "ShpIncotermDirController",
            controllerAs: "ShpIncotermDirCtrl",
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