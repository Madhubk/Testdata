(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneOneOrderLinesForm", oneOneOrderLinesForm);

    oneOneOrderLinesForm.$inject = [];

    function oneOneOrderLinesForm() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_order-lines/form-directive/1_1_lines-form.html",
            link: Link,
            controller: "one_one_OrdLinesFormController",
            controllerAs: "one_one_OrdLinesFormCtrl",
            scope: {
                lineOrder: "=",
                currentOrder: "=",
                action: "=",
                error: "=",
                save: "&"
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();