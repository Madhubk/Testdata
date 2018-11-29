(function () {
    "use strict";

    angular
        .module("Application")
        .directive("threeOneConsolArrivalDeparture", ThreeOneConsolArrivalDeparture);

        ThreeOneConsolArrivalDeparture.$inject = [];

    function ThreeOneConsolArrivalDeparture() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/freight/consolidation/3_1_forwarder_buyer_consolidation/3_1_arrival-departure/three-one-arrival-departure.html",
            link: Link,
            controller: "ThreeOneConsolArrivalDepartureController",
            controllerAs: "ThreeOneConsolArrivalDepartureCtrl",
            scope: {
                currentConsol: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
