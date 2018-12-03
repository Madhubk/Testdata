(function () {
    "use strict";

    angular
        .module("Application")
        .directive("pickupMenu", PickupMenu);

    PickupMenu.$inject = [];

    function PickupMenu() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/pickup-request/pickup-request-menu/pickup-request-menu.html",
            link: Link,
            controller: "PickupMenuController",
            controllerAs: "PickupMenuCtrl",
            scope: {
                currentPickup: "=",
                dataentryObject: '=',
                isHideMenu:"="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }
    }

})();