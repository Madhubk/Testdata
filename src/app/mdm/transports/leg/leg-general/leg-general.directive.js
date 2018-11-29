(function () {
    "use strict";

    angular
        .module("Application")
        .directive("legGeneral", LegGeneral);

    LegGeneral.$inject = [];

    function LegGeneral() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/transports/leg/leg-general/leg-general.html",
            link: Link,
            controller: "LegGeneralController",
            controllerAs: "LegGeneralCtrl",
            scope: {
                currentLeg: "=",
                dataentryObject: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();