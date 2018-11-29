(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneThreeOrderGeneral", oneThreeOrderGeneral);

    oneThreeOrderGeneral.$inject = [];

    function oneThreeOrderGeneral() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order/general/1_3_order-general.html",
            link: Link,
            controller: "one_three_OrdGeneralController",
            controllerAs: "one_three_OrdGeneralCtrl",
            scope: {
                currentOrder: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();