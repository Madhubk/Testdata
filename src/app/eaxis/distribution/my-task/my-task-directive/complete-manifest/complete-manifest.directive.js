(function () {
    "use strict";

    angular
        .module("Application")
        .directive("completemanifest", CompleteManifestDirective);

    function CompleteManifestDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/my-task/my-task-directive/complete-manifest/complete-manifest.html",
            link: Link,
            controller: "CompleteManifestDirectiveController",
            controllerAs: "CompleteManifestCtrl",
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
