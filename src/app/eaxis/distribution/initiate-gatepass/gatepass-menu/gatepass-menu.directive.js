(function () {
    "use strict";

    angular
        .module("Application")
        .directive("gatepassMenu", GatepassMenu);

    GatepassMenu.$inject = [];

    function GatepassMenu() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/initiate-gatepass/gatepass-menu/gatepass-menu.html",
            link: Link,
            controller: "GatepassMenuController",
            controllerAs: "GatepassMenuCtrl",
            scope: {
                currentGatepass: "=",
                dataentryObject: "=",
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();