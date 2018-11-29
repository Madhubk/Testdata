(function () {
    "use strict";

    angular
        .module("Application")
        .directive("confirmmanifest", ConfirmManifestDirective);

    function ConfirmManifestDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/my-task/my-task-directive/confirm-manifest/confirm-manifest.html",
            link: Link,
            controller: "ConfirmManifestDirectiveController",
            controllerAs: "ConfirmManifestCtrl",
            bindToController: true,
            scope: {
                taskObj: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }
})();
