(function () {
    "use strict";

    angular
        .module("Application")
        .directive("deliveryMenu", DeliveryMenu);

    DeliveryMenu.$inject = [];

    function DeliveryMenu() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/delivery-request/delivery-request-menu/delivery-request-menu.html",
            link: Link,
            controller: "DeliveryMenuController",
            controllerAs: "DeliveryMenuCtrl",
            scope: {
                currentDelivery: "=",
                dataentryObject: '='
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }
    }

})();