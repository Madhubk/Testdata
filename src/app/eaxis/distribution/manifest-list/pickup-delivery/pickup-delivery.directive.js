(function () {
    "use strict";

    angular
        .module("Application")
        .directive("pickupDelivery", PickupDelivery);

    PickupDelivery.$inject = ["$compile"];

    function PickupDelivery($compile) {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/manifest-list/pickup-delivery/pickup-delivery.html",
            link: Link,
            controller: "PickupDeliveryController",
            controllerAs: "PickupDeliveryCtrl",
            scope: {
                currentManifest: "=",
                value: "=",
                menuvalue: "=",
                orgfk: "=",
                dataentryObject: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();