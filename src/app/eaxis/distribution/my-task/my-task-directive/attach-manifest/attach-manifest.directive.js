(function () {
    "use strict";

    angular
        .module("Application")
        .directive("attachmanifest", AttachManifestDirective)
        .directive("attachmanifestedit", AttachManifestEditDirective);

    function AttachManifestDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/my-task/my-task-directive/attach-manifest/attach-manifest.html",
            link: Link,
            controller: "AttachManifestDirectiveController",
            controllerAs: "AttachManifestCtrl",
            bindToController: true,
            scope: {
                taskObj: "=",
                onComplete: "&",
                getErrorWarningList: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function AttachManifestEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/my-task/my-task-directive/attach-manifest/attach-manifest-edit.html",
            controller: "AttachManifestDirectiveController",
            controllerAs: "AttachManifestCtrl",
            bindToController: true,
            link: Link,
            scope: {
                taskObj: "=",
                entityObj: "=",
                tabObj: "=",
                onComplete: "&"
            },
            link: Link
        };

        return exports;

        function Link(scope, ele, attr) { }
    }

})();

