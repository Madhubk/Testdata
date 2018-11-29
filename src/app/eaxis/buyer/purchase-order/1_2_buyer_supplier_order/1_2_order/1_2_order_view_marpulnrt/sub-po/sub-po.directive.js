(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneTwoReadOnlySubPo", OneTwoReadOnlySubPo);

    OneTwoReadOnlySubPo.$inject = [];

    function OneTwoReadOnlySubPo() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/1_2_buyer_supplier_order/1_2_order/1_2_read-only-sub-po/1_2_read-only-sub-po.html",
            controller: "one_two_ReadOnlySubPoController",
            controllerAs: "one_two_ReadOnlySubPoCtrl",
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