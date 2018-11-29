(function () {
    "use strict";

    angular
        .module("Application")
        .directive("cargoReadiness", CargoReadiness);

    CargoReadiness.$inject = [];

    function CargoReadiness() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/purchase-order/order/order-tool-bar/cargo-readiness-directive/cargo-readiness.html",
            link: Link,
            controller: "CargoReadinessGridController",
            controllerAs: "CargoReadinessGridCtrl",
            scope: {
                input: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
    }

})();