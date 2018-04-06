(function () {
    "use strict";

    angular
        .module("Application")
        .directive("orderLinesForm", OrderLinesForm);

    OrderLinesForm.$inject = [];

    function OrderLinesForm() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/purchase-order/order/order-lines/form-directive/lines-form.html",
            link: Link,
            controller: "OrdLinesFormController",
            controllerAs: "OrdLinesFormCtrl",
            scope: {
                lineOrder: "=",
                currentOrder: "=",
                action: "=",
                save: "&"
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
