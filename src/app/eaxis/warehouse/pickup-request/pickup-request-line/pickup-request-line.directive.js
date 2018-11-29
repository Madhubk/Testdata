(function () {
    "use strict";

    angular
        .module("Application")
        .directive("pickupLine", PickupLine);

    PickupLine.$inject = [];

    function PickupLine() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/pickup-request/pickup-request-line/pickup-request-line.html",
            link: Link,
            controller: "PickupLineController",
            controllerAs: "PickupLineCtrl",
            scope: {
                currentPickup: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();