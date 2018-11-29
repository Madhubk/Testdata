(function () {
    "use strict";

    angular
        .module("Application")
        .directive("pickupManifestMenu", pickupManifestMenu);

    pickupManifestMenu.$inject = [];

    function pickupManifestMenu() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/transports/pickup-manifest/pickup-manifest-menu/pickup-manifest-menu.html",
            link: Link,
            controller: "PickupManifestMenuController",
            controllerAs: "PickupMenuCtrl",
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