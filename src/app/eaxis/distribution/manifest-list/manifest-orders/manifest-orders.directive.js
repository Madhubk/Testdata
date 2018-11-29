(function () {
    "use strict";

    angular
        .module("Application")
        .directive("dmsManifestOrders", ManifestOrders);

    ManifestOrders.$inject = [];

    function ManifestOrders() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/manifest-list/manifest-orders/manifest-orders.html",
            link: Link,
            controller: "ManifestOrdersController",
            controllerAs: "ManifestOrdersCtrl",
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