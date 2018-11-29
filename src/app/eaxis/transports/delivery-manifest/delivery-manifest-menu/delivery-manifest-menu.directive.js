(function () {
    "use strict";

    angular
        .module("Application")
        .directive("deliveryManifestMenu", DeliveryManifestMenu);

    DeliveryManifestMenu.$inject = [];

    function DeliveryManifestMenu() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/transports/delivery-manifest/delivery-manifest-menu/delivery-manifest-menu.html",
            link: Link,
            controller: "DeliveryManifestMenuController",
            controllerAs: "DeliveryMenuCtrl",
            scope: {
                currentManifest: "=",
                dataentryObject: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }
    }

})();