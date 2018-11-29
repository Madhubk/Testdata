(function () {
    "use strict";

    angular
        .module("Application")
        .directive("oneOneCargoReadinessInline", oneOneCargoReadinessInline);

    oneOneCargoReadinessInline.$inject = [];

    function oneOneCargoReadinessInline() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/buyer/purchase-order/1_1_buyer_order/1_1_order/1_1_cargo-readiness-inline/1_1_cargo-readiness-inline.html",
            link: Link,
            controller: "one_one_CargoReadinessInlineController",
            controllerAs: "one_one_CargoReadinessInlineCtrl",
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