(function () {
    "use strict";

    angular
        .module("Application")
        .directive("pickupManifestCustomToolbar", PickupManifestCustomToolbar);

    PickupManifestCustomToolbar.$inject = [];

    function PickupManifestCustomToolbar() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/transports/pickup-manifest/pickup-manifest-custom-toolbar/pickup-manifest-custom-toolbar.html",
            link: Link,
            controller: "PickupManifestToolBarController",
            controllerAs: "PickupManifestToolBarCtrl",
            scope: {
                input: "=",
                dataentryObject: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }
    }

})();