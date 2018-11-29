(function () {
    "use strict";

    angular
        .module("Application")
        .directive("zoneGeneral", ZoneGeneral);

    ZoneGeneral.$inject = [];

    function ZoneGeneral() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/transports/zone/zone-general/zone-general.html",
            link: Link,
            controller: "ZoneGeneralController",
            controllerAs: "ZoneGeneralCtrl",
            scope: {
                currentZone: "=",
                dataentryObject:"="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();