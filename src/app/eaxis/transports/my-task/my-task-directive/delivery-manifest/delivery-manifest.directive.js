(function () {
    "use strict";

    angular
        .module("Application")
        .directive("deliverymanifest", DeliveryManifestDirective);

    function DeliveryManifestDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/transports/my-task/my-task-directive/delivery-manifest/delivery-manifest.html",
            link: Link,
            controller: "DeliveryManifestDirectiveController",
            controllerAs: "DeliveryManifestDirectiveCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) {}
    }
})();
