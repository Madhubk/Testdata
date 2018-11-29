(function () {
    "use strict";

    angular
        .module("Application")
        .directive("threeThreeOrderLinesForm", ThreeThreeOrderLinesForm);

        ThreeThreeOrderLinesForm.$inject = [];

    function ThreeThreeOrderLinesForm() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_order-lines/3_3_form-directive/3_3_lines-form.html",
            link: Link,
            controller: "three_three_OrdLinesFormController",
            controllerAs: "three_three_OrdLinesFormCtrl",
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