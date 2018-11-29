(function () {
    "use strict";

    angular
        .module("Application")
        .directive("approvemanifestedit", ApproveManifestEditDirective);

    ApproveManifestEditDirective.$inject = [];

    function ApproveManifestEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/my-task/my-task-directive/approve-manifest/approve-manifest-edit/approve-manifest-edit.html",
            controller: "ApproveManifestEditDirectiveController",
            controllerAs: "ApproveManifestEditCtrl",

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
