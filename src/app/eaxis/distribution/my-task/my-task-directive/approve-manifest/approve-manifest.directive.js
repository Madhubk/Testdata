(function () {
    "use strict";

    angular
        .module("Application")
        .directive("approvemanifest", ApproveManifestDirective);

    function ApproveManifestDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/my-task/my-task-directive/approve-manifest/approve-manifest.html",
            link: Link,
            controller: "ApproveManifestDirectiveController",
            controllerAs: "ApproveManifestCtrl",
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
