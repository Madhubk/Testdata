(function () {
    "use strict";

    angular
        .module("Application")
        .directive("threeThreeCargoReadinessInline", ThreeThreeCargoReadinessInline);

        ThreeThreeCargoReadinessInline.$inject = [];

    function ThreeThreeCargoReadinessInline() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/cargo-readiness-inline/cargo-readiness-inline.html",
            link: Link,
            controller: "three_three_CargoReadinessInlineController",
            controllerAs: "three_three_CargoReadinessInlineCtrl",
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