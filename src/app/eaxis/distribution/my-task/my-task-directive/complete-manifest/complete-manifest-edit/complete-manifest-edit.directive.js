(function () {
    "use strict";

    angular
        .module("Application")
        .directive("completemanifestedit", CompleteManifestEditDirective);

    CompleteManifestEditDirective.$inject = [];

    function CompleteManifestEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/my-task/my-task-directive/complete-manifest/complete-manifest-edit/complete-manifest-edit.html",
            controller: "CompleteManifestEditDirectiveController",
            controllerAs: "CompleteManifestEditCtrl",
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
