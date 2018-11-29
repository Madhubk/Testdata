(function () {
    "use strict";

    angular
        .module("Application")
        .directive("confirmmanifestedit", ConfirmManifestEditDirective);

    ConfirmManifestEditDirective.$inject = [];

    function ConfirmManifestEditDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/distribution/my-task/my-task-directive/confirm-manifest/confirm-manifest-edit/confirm-manifest-edit.html",
            controller: "ConfirmManifestEditDirectiveController",
            controllerAs: "ConfirmManifestEditCtrl",
            
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
