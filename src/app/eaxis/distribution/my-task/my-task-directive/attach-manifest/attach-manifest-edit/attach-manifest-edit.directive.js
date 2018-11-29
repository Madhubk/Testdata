(function () {
    "use strict";

    angular
        .module("Application")
        .directive("attachmanifestedit", AttachManifestEditDirective);

    AttachManifestEditDirective.$inject = [];

    function AttachManifestEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/my-task/my-task-directive/attach-manifest/attach-manifest-edit/attach-manifest-edit.html",
            controller: "AttachManifestEditDirectiveController",
            controllerAs: "AttachEditDirectiveCtrl",
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
