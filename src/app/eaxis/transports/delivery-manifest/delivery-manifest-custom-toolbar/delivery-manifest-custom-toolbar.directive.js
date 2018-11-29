(function () {
    "use strict";

    angular
        .module("Application")
        .directive("deliveryManifestCustomToolbar", DeliveryManifestCustomToolbar);

    DeliveryManifestCustomToolbar.$inject = [];

    function DeliveryManifestCustomToolbar() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/transports/delivery-manifest/delivery-manifest-custom-toolbar/delivery-manifest-custom-toolbar.html",
            link: Link,
            controller: "DeliveryManifestToolBarController",
            controllerAs: "DeliveryManifestToolBarCtrl",
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