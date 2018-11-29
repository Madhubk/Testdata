(function () {
    "use strict";

    angular
        .module("Application")
        .directive("pickupDetails", PickupDetails);

    PickupDetails.$inject = [];

    function PickupDetails() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/pickup-request/pickup-details/pickup-details.html",
            link: Link,
            controller: "PickupDetailsController",
            controllerAs: "PickupDetailsCtrl",
            scope: {
                currentPickup: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();