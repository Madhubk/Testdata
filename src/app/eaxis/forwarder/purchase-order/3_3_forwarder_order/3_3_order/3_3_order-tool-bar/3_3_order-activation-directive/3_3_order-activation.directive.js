(function () {
    "use strict";

    angular
        .module("Application")
        .directive("threeThreeOrderActivation", ThreeThreeOrderActivation);

    ThreeThreeOrderActivation.$inject = [];

    function ThreeThreeOrderActivation() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_order-tool-bar/3_3_order-activation-directive/3_3_order-activation.html",
            link: Link,
            controller: "three_three_OrderActivationController",
            controllerAs: "three_three_OrderActivationCtrl",
            scope: {
                input: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
    }

})();