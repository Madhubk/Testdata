(function () {
    "use strict";

    angular
        .module("Application")
        .directive("deliveryConsignmentMenu", DeliveryConsignmentMenu);

    DeliveryConsignmentMenu.$inject = [];

    function DeliveryConsignmentMenu() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/transports/delivery-consignment/delivery-consign-menu/delivery-consign-menu.html",
            link: Link,
            controller: "DeliveryConsignmentMenuController",
            controllerAs: "DeliveryConsignMenuCtrl",
            scope: {
                currentConsignment: "=",
                dataentryObject: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }
    }

})();