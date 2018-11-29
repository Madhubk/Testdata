(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneOneOrderGeneral", oneOneOrderGeneral);

    oneOneOrderGeneral.$inject = [];

    function oneOneOrderGeneral() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/general/1_1_order-general.html",
            link: Link,
            controller: "one_one_OrdGeneralController",
            controllerAs: "one_one_OrdGeneralCtrl",
            scope: {
                currentOrder: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();