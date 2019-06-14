(function () {
    "use strict";

    angular
        .module("Application")
        .directive("inwardGatepass", InwardGatepass);

    InwardGatepass.$inject = [];

    function InwardGatepass() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/inward/inward-gatepass/inward-gatepass.html",
            link: Link,
            controller: "InwardGatepassController",
            controllerAs: "InwardGatepassCtrl",
            scope: {
                currentInward: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();