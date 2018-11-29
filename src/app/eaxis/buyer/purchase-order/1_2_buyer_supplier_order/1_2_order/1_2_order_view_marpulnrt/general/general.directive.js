(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneTwoReadOnlyGeneral", OneTwoReadOnlyGeneral);

    OneTwoReadOnlyGeneral.$inject = [];

    function OneTwoReadOnlyGeneral() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/1_2_buyer_supplier_order/1_2_order/1_2_read-only-general/1_2_read-only-general.html",
            controller: "one_two_ReadOnlyGeneralController",
            controllerAs: "one_two_ReadOnlyGeneralCtrl",
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