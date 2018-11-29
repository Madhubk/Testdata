(function () {
    "use strict";

    angular
        .module("Application")
        .directive("cargoReadinessInline", CargoReadinessInline);

    CargoReadinessInline.$inject = [];

    function CargoReadinessInline() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/purchase-order/order/cargo-readiness-inline/cargo-readiness-inline.html",
            link: Link,
            controller: "CargoReadinessInlineController",
            controllerAs: "CargoReadinessInlineCtrl",
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