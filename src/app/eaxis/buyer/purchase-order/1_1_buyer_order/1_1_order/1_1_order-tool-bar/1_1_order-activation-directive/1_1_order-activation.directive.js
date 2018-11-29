(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneOneOrderActivation", oneOneOrderActivation);

    oneOneOrderActivation.$inject = [];

    function oneOneOrderActivation() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_order-tool-bar/1_1_order-activation-directive/1_1_order-activation.html",
            link: Link,
            controller: "one_one_OrderActivationController",
            controllerAs: "one_one_OrderActivationCtrl",
            scope: {
                input: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
    }

})();