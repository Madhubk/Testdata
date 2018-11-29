(function () {
    "use strict";

    angular
        .module("Application")
        .directive("regionGeneral", RegionGeneral);

    RegionGeneral.$inject = [];

    function RegionGeneral() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/transports/region/region-general/region-general.html",
            link: Link,
            controller: "RegionGeneralController",
            controllerAs: "RegionGeneralCtrl",
            scope: {
                currentRegion: "=",
                dataentryObject:"="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();