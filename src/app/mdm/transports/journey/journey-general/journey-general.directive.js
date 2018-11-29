(function () {
    "use strict";

    angular
        .module("Application")
        .directive("journeyGeneral", JourneyGeneral);

    JourneyGeneral.$inject = [];

    function JourneyGeneral() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/transports/journey/journey-general/journey-general.html",
            link: Link,
            controller: "JourneyGeneralController",
            controllerAs: "JourneyGeneralCtrl",
            scope: {
                currentJourney: "=",
                dataentryObject:"="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();