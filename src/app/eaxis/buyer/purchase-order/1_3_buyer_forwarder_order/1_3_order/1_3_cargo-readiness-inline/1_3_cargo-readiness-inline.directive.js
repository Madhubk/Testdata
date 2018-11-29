(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneThreeCargoReadinessInline", oneThreeCargoReadinessInline);

    oneThreeCargoReadinessInline.$inject = [];

    function oneThreeCargoReadinessInline() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order/1_3_cargo-readiness-inline/1_3_cargo-readiness-inline.html",
            link: Link,
            controller: "one_three_CargoReadinessInlineController",
            controllerAs: "one_three_CargoReadinessInlineCtrl",
            scope: {
                currentObject: "=",
                btnVisible: "=",
                readOnly: "=",
                gridChange: "&",
                tableProperties: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();