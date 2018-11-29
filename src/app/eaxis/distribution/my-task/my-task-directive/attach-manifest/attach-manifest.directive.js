(function () {
    "use strict";

    angular
        .module("Application")
        .directive("attachmanifest", AttachManifestDirective);

    function AttachManifestDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/my-task/my-task-directive/attach-manifest/attach-manifest.html",
            link: Link,
            controller: "AttachManifestDirectiveController",
            controllerAs: "AttachManifestDirectiveCtrl",
            bindToController: true,
            scope: {
                taskObj: "=",
                onComplete: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }
})();
