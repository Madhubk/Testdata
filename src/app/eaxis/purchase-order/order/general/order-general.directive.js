(function () {
    "use strict";

    angular
        .module("Application")
        .directive("orderGeneral", OrderGeneral);

    OrderGeneral.$inject = [];

    function OrderGeneral() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/purchase-order/order/general/order-general.html",
            link: Link,
            controller: "OrdGeneralController",
            controllerAs: "OrdGeneralCtrl",
            scope: {
                currentOrder: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();