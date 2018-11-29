(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneTwoReadOnlyOrdLine", OneTwoReadOnlyOrdLine);

    OneTwoReadOnlyOrdLine.$inject = [];

    function OneTwoReadOnlyOrdLine() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/1_2_buyer_supplier_order/1_2_order/1_2_read-only-ord-line/1_2_read-only-ord-line.html",
            controller: "one_two_ReadOnlyOrdLineController",
            controllerAs: "one_two_ReadOnlyOrdLineCtrl",
            scope: {
                obj: "="
            },
            link: Link,
            bindToController: true
        };
        return exports;

        function Link(scope, ele, attr) {}
    }
})();