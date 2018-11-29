(function () {
    "use strict";

    angular
        .module("Application")
        .directive("threeThreeOrderGeneral", ThreeThreeOrderGeneral);

    ThreeThreeOrderGeneral.$inject = [];

    function ThreeThreeOrderGeneral() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_general/3_3_order-general.html",
            link: Link,
            controller: "three_three_OrdGeneralController",
            controllerAs: "three_three_OrdGeneralCtrl",
            scope: {
                currentOrder: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();