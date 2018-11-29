(function () {
    "use strict";

    angular
        .module("Application")
        .directive("gatepassGeneral", GatepassGeneral);

    GatepassGeneral.$inject = [];

    function GatepassGeneral() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/initiate-gatepass/gatepass-general/gatepass-general.html",
            link: Link,
            controller: "GatepassGeneralController",
            controllerAs: "GatepassGeneralCtrl",
            scope: {
                currentGatepass: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();