(function () {
    "use strict";

    angular
        .module("Application")
        .directive("pickupConsignmentMenu", pickupConsignmentMenu);

    pickupConsignmentMenu.$inject = [];

    function pickupConsignmentMenu() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/transports/pickup-consignment/pickup-consign-menu/pickup-consign-menu.html",
            link: Link,
            controller: "PickupConsignMenuController",
            controllerAs: "PickupConsignMenuCtrl",
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