(function () {
    "use strict";

    angular
        .module("Application")
        .directive("threeThreeCargoReadiness", ThreeThreeCargoReadiness);

    ThreeThreeCargoReadiness.$inject = [];

    function ThreeThreeCargoReadiness() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_order-tool-bar/3_3_cargo-readiness-directive/3_3_cargo-readiness.html",
            link: Link,
            controller: "three_three_CargoReadinessGridController",
            controllerAs: "three_three_CargoReadinessGridCtrl",
            scope: {
                input: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
    }

})();