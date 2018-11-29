(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneThreeOrderLinesForm", oneThreeOrderLinesForm);

    oneThreeOrderLinesForm.$inject = [];

    function oneThreeOrderLinesForm() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order/1_3_order-lines/form-directive/1_3_lines-form.html",
            link: Link,
            controller: "one_three_OrdLinesFormController",
            controllerAs: "one_three_OrdLinesFormCtrl",
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