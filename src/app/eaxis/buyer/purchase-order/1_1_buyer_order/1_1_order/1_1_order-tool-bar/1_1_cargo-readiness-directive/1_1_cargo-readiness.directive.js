(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneOneCargoReadiness", oneOneCargoReadiness);

    oneOneCargoReadiness.$inject = [];

    function oneOneCargoReadiness() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_order-tool-bar/1_1_cargo-readiness-directive/1_1_cargo-readiness.html",
            link: Link,
            controller: "one_one_CargoReadinessGridController",
            controllerAs: "one_one_CargoReadinessGridCtrl",
            scope: {
                input: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
    }

})();