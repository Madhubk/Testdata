(function () {
    "use strict";

    angular
        .module("Application")
        .directive("pickupmanifest", PickupManifestDirective);

    function PickupManifestDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/transports/my-task/my-task-directive/pickup-manifest/pickup-manifest.html",
            link: Link,
            controller: "PickupManifestDirectiveController",
            controllerAs: "PickupManifestDirectiveCtrl",
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
