(function () {
    "use strict";

    angular
        .module("Application")
        .directive("threeOneOrderGeneral", threeOneOrderGeneral);

    threeOneOrderGeneral.$inject = [];

    function threeOneOrderGeneral() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/forwarder/purchase-order/3_1_forwarder_buyer_order/3_1_order/general/3_1_order-general.html",
            link: Link,
            controller: "three_one_OrdGeneralController",
            controllerAs: "three_one_OrdGeneralCtrl",
            scope: {
                currentOrder: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();