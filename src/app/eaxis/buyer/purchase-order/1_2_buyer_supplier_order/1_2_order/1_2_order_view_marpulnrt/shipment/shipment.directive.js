(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneTwoReadOnlyShipment", OneTwoReadOnlyShipment);

    OneTwoReadOnlyShipment.$inject = [];

    function OneTwoReadOnlyShipment() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/1_2_buyer_supplier_order/1_2_order/1_2_read-only-shipment/1_2_read-only-shipment.html",
            controller: "one_two_ReadOnlyShipmentController",
            controllerAs: "one_two_ReadOnlyShipmentCtrl",
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