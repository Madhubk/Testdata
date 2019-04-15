(function () {
    "use strict";

    angular
        .module("Application")
        .directive("deliveryLineMenu", DeliveryLineMenu);

    DeliveryLineMenu.$inject = [];

    function DeliveryLineMenu() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/delivery-line/delivery-line-menu/delivery-line-menu.html",
            link: Link,
            controller: "DeliveryLineMenuController",
            controllerAs: "DeliveryLineMenuCtrl",
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