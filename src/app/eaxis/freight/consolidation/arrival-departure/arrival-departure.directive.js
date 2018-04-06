(function () {
    "use strict";

    angular
        .module("Application")
        .directive("consolArrivalDeparture", ConsolArrivalDeparture);

        ConsolArrivalDeparture.$inject = [];

    function ConsolArrivalDeparture() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/consolidation/arrival-departure/arrival-departure.html",
            link: Link,
            controller: "ConsolArrivalDepartureController",
            controllerAs: "ConsolArrivalDepartureCtrl",
            scope: {
                currentConsol: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
