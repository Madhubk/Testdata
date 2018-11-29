(function () {
    "use strict"
    angular
        .module("Application")
        .directive("modeexc", ModeExc);

    function ModeExc() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/shipment-event/shp-mode/shp-mode-event.html",
            link: Link,
            controller: "ShpTransModeDirController",
            controllerAs: "ShpTransModeDirCtrl",
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