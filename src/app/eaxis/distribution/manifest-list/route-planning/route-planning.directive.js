(function () {
    "use strict";

    angular
        .module("Application")
        .directive("routePlanning", RoutePlanning);

    RoutePlanning.$inject = [];

    function RoutePlanning() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/manifest-list/route-planning/route-planning.html",
            link: Link,
            controller: "RoutePlanningController",
            controllerAs: "RoutePlanningCtrl",
            scope: {
                currentManifest: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }
    }

})();