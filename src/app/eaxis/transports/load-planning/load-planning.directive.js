(function () {
    "use strict";

    angular
        .module("Application")
        .directive("loadPlanning", LoadPlanning);

    LoadPlanning.$inject = [];

    function LoadPlanning() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/transports/load-planning/load-planning.html",
            link: Link,
            controller: "LoadPlanningController",
            controllerAs: "LoadPlanningCtrl",
            scope: {
                dataentryObject: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }
    }

})();