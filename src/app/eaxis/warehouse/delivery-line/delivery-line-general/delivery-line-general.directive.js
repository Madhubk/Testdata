(function () {
    "use strict";

    angular
        .module("Application")
        .directive("deliveryLineGeneral", DeliveryLineGeneral);

    DeliveryLineGeneral.$inject = [];

    function DeliveryLineGeneral() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/delivery-line/delivery-line-general/delivery-line-general.html",
            link: Link,
            controller: "DeliveryLineGeneralController",
            controllerAs: "DeliveryLineGeneralCtrl",
            scope: {
                currentDelivery: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();