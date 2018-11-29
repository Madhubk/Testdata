(function () {
    "use strict";

    angular
        .module("Application")
        .directive("deliveryLine", DeliveryLine);

    DeliveryLine.$inject = [];

    function DeliveryLine() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/delivery-request/delivery-request-line/delivery-request-line.html",
            link: Link,
            controller: "DeliveryLineController",
            controllerAs: "DeliveryLineCtrl",
            scope: {
                currentDelivery: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();