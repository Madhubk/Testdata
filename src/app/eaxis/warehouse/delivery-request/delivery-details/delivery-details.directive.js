(function () {
    "use strict";

    angular
        .module("Application")
        .directive("deliveryDetails", DeliveryDetails);

    DeliveryDetails.$inject = [];

    function DeliveryDetails() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/delivery-request/delivery-details/delivery-details.html",
            link: Link,
            controller: "DeliveryDetailsController",
            controllerAs: "DeliveryDetailsCtrl",
            scope: {
                currentDelivery: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();